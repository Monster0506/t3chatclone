-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create tables
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    email text not null unique,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.user_settings (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    name text,
    occupation text,
    traits jsonb,
    theme text,
    language text,
    notification_preferences jsonb,
    extra text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

create table if not exists public.chats (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    model text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb,
    public boolean not null default false -- Whether this chat is public/shareable
);

create table if not exists public.messages (
    id uuid default uuid_generate_v4() primary key,
    chat_id uuid references public.chats(id) on delete cascade not null,
    role text not null,
    content text not null,
    type text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb
);

create table if not exists public.attachments (
    id uuid default uuid_generate_v4() primary key,
    message_id uuid references public.messages(id) on delete cascade not null,
    file_name text not null,
    file_type text not null,
    file_size bigint not null,
    url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb
);

-- Create indexes
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_chats_user_id on public.chats(user_id);
create index if not exists idx_messages_chat_id on public.messages(chat_id);
create index if not exists idx_attachments_message_id on public.attachments(message_id);

-- Create RLS policies
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.attachments enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

-- User settings policies
create policy "Users can view their own settings"
    on public.user_settings for select
    using (auth.uid() = user_id);

create policy "Users can update their own settings"
    on public.user_settings for update
    using (auth.uid() = user_id);

-- Chats policies
create policy "Users can view their own chats"
    on public.chats for select
    using (auth.uid() = user_id OR public);

create policy "Users can create their own chats"
    on public.chats for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own chats"
    on public.chats for update
    using (auth.uid() = user_id);

create policy "Users can delete their own chats"
    on public.chats for delete
    using (auth.uid() = user_id);

-- Messages policies
create policy "Users can view messages in their chats"
    on public.messages for select
    using (
        exists (
            select 1 from public.chats
            where chats.id = messages.chat_id
            and chats.user_id = auth.uid()
        )
    );

create policy "Users can create messages in their chats"
    on public.messages for insert
    with check (
        exists (
            select 1 from public.chats
            where chats.id = messages.chat_id
            and chats.user_id = auth.uid()
        )
    );

create policy "Users can update messages in their chats"
    on public.messages for update
    using (
        exists (
            select 1 from public.chats
            where chats.id = messages.chat_id
            and chats.user_id = auth.uid()
        )
    );

create policy "Users can delete messages in their chats"
    on public.messages for delete
    using (
        exists (
            select 1 from public.chats
            where chats.id = messages.chat_id
            and chats.user_id = auth.uid()
        )
    );

-- Attachments policies
create policy "Users can view attachments in their messages"
    on public.attachments for select
    using (
        exists (
            select 1 from public.messages
            join public.chats on chats.id = messages.chat_id
            where messages.id = attachments.message_id
            and chats.user_id = auth.uid()
        )
    );

create policy "Users can create attachments in their messages"
    on public.attachments for insert
    with check (
        exists (
            select 1 from public.messages
            join public.chats on chats.id = messages.chat_id
            where messages.id = attachments.message_id
            and chats.user_id = auth.uid()
        )
    );

create policy "Users can delete attachments in their messages"
    on public.attachments for delete
    using (
        exists (
            select 1 from public.messages
            join public.chats on chats.id = messages.chat_id
            where messages.id = attachments.message_id
            and chats.user_id = auth.uid()
        )
    ); 

create policy "Users can insert their own settings"
    on public.user_settings for insert
    with check (auth.uid() = user_id);