-- Enable necessary extensions
-- This extension is typically needed for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone for default timestamps
SET TIMEZONE TO 'UTC';

-- Create tables

-- public.profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email text NOT NULL UNIQUE,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- public.user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name text,
    occupation text,
    traits jsonb,
    theme text,
    language text,
    notification_preferences jsonb,
    extra text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- public.chats table
CREATE TABLE IF NOT EXISTS public.chats (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    model text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata jsonb,
    public boolean NOT NULL DEFAULT false -- Whether this chat is public/shareable
);

-- public.messages table
-- Note: id is TEXT as per your requirement
CREATE TABLE IF NOT EXISTS public.messages (
    id text DEFAULT uuid_generate_v4()::text PRIMARY KEY, -- Changed to TEXT
    chat_id uuid REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata jsonb
);

-- public.attachments table
-- Note: message_id is TEXT to match public.messages.id
CREATE TABLE IF NOT EXISTS public.attachments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id text REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL, -- Changed to TEXT
    file_name text NOT NULL,
    file_type text NOT NULL,
    file_size bigint NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata jsonb
);

-- All Chats Index table (public.chat_index)
-- Note: message_id is TEXT to match public.messages.id
CREATE TABLE IF NOT EXISTS public.chat_index (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id uuid REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
    message_id text REFERENCES public.messages(id) ON DELETE CASCADE, -- Changed to TEXT
    type text NOT NULL, -- e.g. 'question', 'answer', 'code', 'summary', 'decision'
    snippet text NOT NULL,
    score float,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata jsonb -- extensible for future use (e.g. tags, Gemini output, etc)
);

-- public.code_conversions table
-- Note: message_id is TEXT to match public.messages.id
CREATE TABLE IF NOT EXISTS public.code_conversions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id text REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL, -- Changed to TEXT
    code_block_index integer NOT NULL, -- e.g., 0 for the first block, 1 for the second
    target_language text NOT NULL,
    converted_content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata jsonb,
    UNIQUE (message_id, code_block_index, target_language) -- Ensures uniqueness for each block, each language
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
-- Index for message_id on attachments - now on TEXT type
CREATE INDEX IF NOT EXISTS idx_attachments_message_id ON public.attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_index_chat_id ON public.chat_index(chat_id);
-- Index for message_id on chat_index - now on TEXT type
CREATE INDEX IF NOT EXISTS idx_chat_index_message_id ON public.chat_index(message_id);
-- Index for message_id on code_conversions - now on TEXT type
CREATE INDEX IF NOT EXISTS idx_code_conversions_message_id ON public.code_conversions(message_id);


-- Enable RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_conversions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- User settings policies
CREATE POLICY "Users can view their own settings"
    ON public.user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON public.user_settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON public.user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Chats policies
CREATE POLICY "Users can view their own chats"
    ON public.chats FOR SELECT
    USING (auth.uid() = user_id OR public);

CREATE POLICY "Users can create their own chats"
    ON public.chats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats"
    ON public.chats FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chats"
    ON public.chats FOR DELETE
    USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in their chats"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = messages.chat_id
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create messages in their chats"
    ON public.messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = messages.chat_id
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update messages in their chats"
    ON public.messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = messages.chat_id
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete messages in their chats"
    ON public.messages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = messages.chat_id
            AND chats.user_id = auth.uid()
        )
    );

-- Attachments policies
CREATE POLICY "Users can view attachments in their messages"
    ON public.attachments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.messages
            JOIN public.chats ON chats.id = messages.chat_id
            WHERE messages.id = attachments.message_id
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create attachments in their messages"
    ON public.attachments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.messages
            JOIN public.chats ON chats.id = messages.chat_id
            WHERE messages.id = attachments.message_id
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete attachments in their messages"
    ON public.attachments FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.messages
            JOIN public.chats ON chats.id = messages.chat_id
            WHERE messages.id = attachments.message_id
            AND chats.user_id = auth.uid()
        )
    );

-- RLS policies for chat_index
CREATE POLICY "Users can view index items in their chats"
    ON public.chat_index FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = chat_index.chat_id
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert index items in their chats"
    ON public.chat_index FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = chat_index.chat_id
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update index items in their chats"
    ON public.chat_index FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = chat_index.chat_id
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete index items in their chats"
    ON public.chat_index FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = chat_index.chat_id
            AND chats.user_id = auth.uid()
        )
    );

-- RLS policies for code_conversions
CREATE POLICY "Users can view code conversions in their chats"
    ON public.code_conversions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.messages
            JOIN public.chats ON chats.id = messages.chat_id
            WHERE messages.id = code_conversions.message_id
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create code conversions in their chats"
    ON public.code_conversions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.messages
            JOIN public.chats ON chats.id = messages.chat_id
            WHERE messages.id = code_conversions.message_id
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update code conversions in their chats"
    ON public.code_conversions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.messages
            JOIN public.chats ON chats.id = messages.chat_id
            WHERE messages.id = code_conversions.message_id
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete code conversions in their chats"
    ON public.code_conversions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.messages
            JOIN public.chats ON chats.id = messages.chat_id
            WHERE messages.id = code_conversions.message_id
            AND chats.user_id = auth.uid()
        )
    );