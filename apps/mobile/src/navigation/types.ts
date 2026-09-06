import type { NavigatorScreenParams } from '@react-navigation/native';

export type OnboardingStackParamList = {
  Welcome: undefined;
  Login: undefined;
  OAuthCallback: { provider?: string; code?: string } | undefined;
  RoleSelection: undefined;
  OfferingSeeking: undefined;
  Skills: undefined;
  ExperienceAvailability: undefined;
  Bio: undefined;
  AvatarHeadline: undefined;
  ProfileCompletionSuccess: undefined;
};

export type IdeaUploadStackParamList = {
  IdeaEntry: undefined;
  GitHubConnect: undefined;
  RepoSelection: { repos?: any[] } | undefined;
  AIScanLoading: { ideaId?: string; repoFullName?: string } | undefined;
  AIScanResults: { ideaId?: string; scanData?: any } | undefined;
  MissingGaps: { ideaId?: string } | undefined;
  VisibilitySettings: { ideaId?: string } | undefined;
  PublishConfirmation: { ideaId?: string } | undefined;
};

export type MatchesStackParamList = {
  MyIdeas: undefined;
  MatchesFeed: { ideaId?: string } | undefined;
  CandidateProfile: { candidateId?: string; matchId?: string } | undefined;
  MatchIntroModal: { candidateId?: string; matchId?: string } | undefined;
  DeepDiveReport: { matchId?: string } | undefined;
};

export type HandshakeStackParamList = {
  ScheduleMeeting: { matchId?: string; partnerName?: string } | undefined;
  MeetingFeedback: { matchId?: string; partnerName?: string } | undefined;
  NFCPreparation: { matchId?: string; partnerName?: string } | undefined;
  NFCHandshake: { matchId?: string; partnerName?: string } | undefined;
  NFCSuccess: { matchId?: string; partnerName?: string } | undefined;
  NFCTimeoutError: { matchId?: string; partnerName?: string } | undefined;
};

export type Group5StackParamList = {
  ChatConversation: { threadId: string; partnerName?: string } | undefined;
  IdeaSearch: { query?: string } | undefined;
  PublicIdeaDetails: { ideaId: string } | undefined;
  EditProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
};

export type WorkspaceStackParamList = {
  WorkspaceOverview: { workspaceId: string } | undefined;
  IdeaBoard: { workspaceId: string } | undefined;
  Roadmap: { workspaceId: string } | undefined;
  DecisionLog: { workspaceId: string } | undefined;
  EquityFramework: { workspaceId: string } | undefined;
  Partnerships: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<MatchesStackParamList>;
  PublicTab: undefined;
  InboxTab: undefined;
  WorkspaceTab: NavigatorScreenParams<WorkspaceStackParamList>;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  IdeaUpload: NavigatorScreenParams<IdeaUploadStackParamList>;
  MainApp: NavigatorScreenParams<MainTabParamList>;
  Handshake: NavigatorScreenParams<HandshakeStackParamList>;
  Group5Flow: NavigatorScreenParams<Group5StackParamList>;
  WorkspaceFlow: NavigatorScreenParams<WorkspaceStackParamList>;
};
