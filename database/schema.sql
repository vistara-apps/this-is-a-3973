-- EchoMapper Database Schema for Supabase
-- This file contains the SQL commands to set up the database structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    subscription JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recordings table
CREATE TABLE public.recordings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    audio_url TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis results table
CREATE TABLE public.analysis_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recording_id UUID REFERENCES public.recordings(id) ON DELETE CASCADE NOT NULL,
    species TEXT NOT NULL,
    call_type TEXT,
    confidence_score DECIMAL(5, 2),
    behavioral_insight TEXT,
    alternative_species JSONB DEFAULT '[]',
    environmental_context TEXT,
    recommendations TEXT,
    model_version TEXT DEFAULT 'gpt-4-whisper-1',
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Labels table (for crowdsourced labeling)
CREATE TABLE public.labels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recording_id UUID REFERENCES public.recordings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    species_suggestion TEXT NOT NULL,
    call_type_suggestion TEXT,
    comment TEXT,
    confidence INTEGER CHECK (confidence >= 1 AND confidence <= 10),
    votes_up INTEGER DEFAULT 0,
    votes_down INTEGER DEFAULT 0,
    is_validated BOOLEAN DEFAULT FALSE,
    validated_by UUID REFERENCES public.users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Label votes table (to track who voted on what)
CREATE TABLE public.label_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES public.labels(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    vote_type TEXT CHECK (vote_type IN ('up', 'down')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(label_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_recordings_user_id ON public.recordings(user_id);
CREATE INDEX idx_recordings_timestamp ON public.recordings(timestamp);
CREATE INDEX idx_recordings_location ON public.recordings(latitude, longitude);
CREATE INDEX idx_analysis_results_recording_id ON public.analysis_results(recording_id);
CREATE INDEX idx_analysis_results_species ON public.analysis_results(species);
CREATE INDEX idx_labels_recording_id ON public.labels(recording_id);
CREATE INDEX idx_labels_user_id ON public.labels(user_id);
CREATE INDEX idx_label_votes_label_id ON public.label_votes(label_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.label_votes ENABLE ROW LEVEL SECURITY;

-- Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own recordings
CREATE POLICY "Users can view own recordings" ON public.recordings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recordings" ON public.recordings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recordings" ON public.recordings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recordings" ON public.recordings
    FOR DELETE USING (auth.uid() = user_id);

-- Analysis results are viewable by recording owner
CREATE POLICY "Users can view analysis results for own recordings" ON public.analysis_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.recordings 
            WHERE recordings.id = analysis_results.recording_id 
            AND recordings.user_id = auth.uid()
        )
    );

CREATE POLICY "System can insert analysis results" ON public.analysis_results
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.recordings 
            WHERE recordings.id = analysis_results.recording_id 
            AND recordings.user_id = auth.uid()
        )
    );

-- Labels are viewable by everyone (for community features)
CREATE POLICY "Anyone can view labels" ON public.labels
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert labels" ON public.labels
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own labels" ON public.labels
    FOR UPDATE USING (auth.uid() = user_id);

-- Label votes are viewable by everyone
CREATE POLICY "Anyone can view label votes" ON public.label_votes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON public.label_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON public.label_votes
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recordings_updated_at BEFORE UPDATE ON public.recordings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_labels_updated_at BEFORE UPDATE ON public.labels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update label vote counts
CREATE OR REPLACE FUNCTION update_label_votes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 'up' THEN
            UPDATE public.labels SET votes_up = votes_up + 1 WHERE id = NEW.label_id;
        ELSE
            UPDATE public.labels SET votes_down = votes_down + 1 WHERE id = NEW.label_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 'up' THEN
            UPDATE public.labels SET votes_up = votes_up - 1 WHERE id = OLD.label_id;
        ELSE
            UPDATE public.labels SET votes_down = votes_down - 1 WHERE id = OLD.label_id;
        END IF;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle vote type change
        IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
            UPDATE public.labels SET votes_up = votes_up - 1, votes_down = votes_down + 1 WHERE id = NEW.label_id;
        ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
            UPDATE public.labels SET votes_up = votes_up + 1, votes_down = votes_down - 1 WHERE id = NEW.label_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_label_votes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.label_votes
    FOR EACH ROW EXECUTE FUNCTION update_label_votes();

-- Storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-recordings', 'audio-recordings', false);

-- Storage policies
CREATE POLICY "Users can upload own audio files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'audio-recordings' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own audio files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'audio-recordings' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own audio files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'audio-recordings' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Sample data for development (optional)
-- INSERT INTO public.users (id, username, subscription_tier) VALUES 
--     ('00000000-0000-0000-0000-000000000001', 'demo_user', 'free');

-- Comments for documentation
COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.recordings IS 'Audio recordings uploaded by users';
COMMENT ON TABLE public.analysis_results IS 'AI analysis results for recordings';
COMMENT ON TABLE public.labels IS 'Crowdsourced labels and corrections from community';
COMMENT ON TABLE public.label_votes IS 'Votes on community labels';

COMMENT ON COLUMN public.recordings.latitude IS 'Recording location latitude (WGS84)';
COMMENT ON COLUMN public.recordings.longitude IS 'Recording location longitude (WGS84)';
COMMENT ON COLUMN public.analysis_results.confidence_score IS 'AI confidence score (0-100)';
COMMENT ON COLUMN public.labels.confidence IS 'User confidence in their label (1-10)';
