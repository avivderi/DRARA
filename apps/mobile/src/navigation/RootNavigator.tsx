import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';

import { BottomTabBar, TabType } from '../components/layout/footers/BottomTabBar';
import { AvatarHeadlineScreen } from '../screens/group1/AvatarHeadlineScreen';
import { BioScreen } from '../screens/group1/BioScreen';
import { ExperienceAvailabilityScreen } from '../screens/group1/ExperienceAvailabilityScreen';
import { LoginScreen } from '../screens/group1/LoginScreen';
import { OAuthCallbackScreen } from '../screens/group1/OAuthCallbackScreen';
import { OfferingSeekingScreen } from '../screens/group1/OfferingSeekingScreen';
import { ProfileCompletionSuccessScreen } from '../screens/group1/ProfileCompletionSuccessScreen';
import { RoleSelectionScreen } from '../screens/group1/RoleSelectionScreen';
import { SkillsScreen } from '../screens/group1/SkillsScreen';
import { WelcomeScreen } from '../screens/group1/WelcomeScreen';
import { AIScanLoadingScreen } from '../screens/group2/AIScanLoadingScreen';
import { AIScanResultsScreen } from '../screens/group2/AIScanResultsScreen';
import { GitHubConnectScreen } from '../screens/group2/GitHubConnectScreen';
import { IdeaEntryScreen } from '../screens/group2/IdeaEntryScreen';
import { MissingGapsScreen } from '../screens/group2/MissingGapsScreen';
import { PublishConfirmationScreen } from '../screens/group2/PublishConfirmationScreen';
import { RepoSelectionScreen } from '../screens/group2/RepoSelectionScreen';
import { VisibilitySettingsScreen } from '../screens/group2/VisibilitySettingsScreen';
import { CandidateProfileScreen } from '../screens/group3/CandidateProfileScreen';
import { DeepDiveReportScreen } from '../screens/group3/DeepDiveReportScreen';
import { MatchIntroModalScreen } from '../screens/group3/MatchIntroModalScreen';
import { MatchesFeedScreen } from '../screens/group3/MatchesFeedScreen';
import { MyIdeasScreen } from '../screens/group3/MyIdeasScreen';
import { MeetingFeedbackScreen } from '../screens/group4/MeetingFeedbackScreen';
import { NFCHandshakeScreen } from '../screens/group4/NFCHandshakeScreen';
import { NFCPreparationScreen } from '../screens/group4/NFCPreparationScreen';
import { NFCSuccessScreen } from '../screens/group4/NFCSuccessScreen';
import { NFCTimeoutErrorScreen } from '../screens/group4/NFCTimeoutErrorScreen';
import { ScheduleMeetingScreen } from '../screens/group4/ScheduleMeetingScreen';
import { ChatConversationScreen } from '../screens/group5/ChatConversationScreen';
import { EditProfileScreen } from '../screens/group5/EditProfileScreen';
import { IdeaSearchScreen } from '../screens/group5/IdeaSearchScreen';
import { InboxScreen } from '../screens/group5/InboxScreen';
import { NotificationsScreen } from '../screens/group5/NotificationsScreen';
import { PublicFeedScreen } from '../screens/group5/PublicFeedScreen';
import { PublicIdeaDetailsScreen } from '../screens/group5/PublicIdeaDetailsScreen';
import { SettingsScreen } from '../screens/group5/SettingsScreen';
import { UserProfileScreen } from '../screens/group5/UserProfileScreen';
import { DecisionLogScreen } from '../screens/group6/DecisionLogScreen';
import { EquityFrameworkScreen } from '../screens/group6/EquityFrameworkScreen';
import { IdeaBoardScreen } from '../screens/group6/IdeaBoardScreen';
import { PartnershipsScreen } from '../screens/group6/PartnershipsScreen';
import { RoadmapScreen } from '../screens/group6/RoadmapScreen';
import { WorkspaceOverviewScreen } from '../screens/group6/WorkspaceOverviewScreen';

import type {
  Group5StackParamList,
  HandshakeStackParamList,
  IdeaUploadStackParamList,
  MainTabParamList,
  MatchesStackParamList,
  OnboardingStackParamList,
  RootStackParamList,
  WorkspaceStackParamList,
} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const IdeaUploadStack = createNativeStackNavigator<IdeaUploadStackParamList>();
const MatchesStack = createNativeStackNavigator<MatchesStackParamList>();
const HandshakeStack = createNativeStackNavigator<HandshakeStackParamList>();
const Group5Stack = createNativeStackNavigator<Group5StackParamList>();
const WorkspaceStack = createNativeStackNavigator<WorkspaceStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Group 1: Onboarding Navigator
function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Welcome">
        {({ navigation }) => (
          <WelcomeScreen
            onGoogleSignIn={() => navigation.navigate('RoleSelection')}
            onGitHubSignIn={() => navigation.navigate('RoleSelection')}
            onEmailSignIn={() => navigation.navigate('Login')}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen
            onBackPress={() => navigation.goBack()}
            onLoginSubmit={() => navigation.navigate('RoleSelection')}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="OAuthCallback">
        {({ navigation }) => (
          <OAuthCallbackScreen
            onContinue={() => navigation.navigate('RoleSelection')}
            onRetry={() => navigation.navigate('Login')}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="RoleSelection">
        {({ navigation }) => (
          <RoleSelectionScreen
            currentStep={1}
            totalSteps={7}
            onBackPress={() => navigation.goBack()}
            onNext={() => navigation.navigate('OfferingSeeking')}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="OfferingSeeking">
        {({ navigation }) => (
          <OfferingSeekingScreen
            currentStep={2}
            totalSteps={7}
            onBackPress={() => navigation.goBack()}
            onNext={() => navigation.navigate('Skills')}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Skills">
        {({ navigation }) => (
          <SkillsScreen
            currentStep={3}
            totalSteps={7}
            onBackPress={() => navigation.goBack()}
            onNext={() => navigation.navigate('ExperienceAvailability')}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="ExperienceAvailability">
        {({ navigation }) => (
          <ExperienceAvailabilityScreen
            currentStep={4}
            totalSteps={7}
            onBackPress={() => navigation.goBack()}
            onNext={() => navigation.navigate('Bio')}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Bio">
        {({ navigation }) => (
          <BioScreen
            currentStep={5}
            totalSteps={7}
            onBackPress={() => navigation.goBack()}
            onNext={() => navigation.navigate('AvatarHeadline')}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="AvatarHeadline">
        {({ navigation }) => (
          <AvatarHeadlineScreen
            currentStep={6}
            totalSteps={7}
            onBackPress={() => navigation.goBack()}
            onNext={() => navigation.navigate('ProfileCompletionSuccess')}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="ProfileCompletionSuccess">
        {({ navigation }: any) => (
          <ProfileCompletionSuccessScreen
            onViewMatches={() => navigation.replace('MainApp', { screen: 'HomeTab' })}
            onCreateIdea={() => (navigation.getParent())?.navigate('IdeaUpload')}
          />
        )}
      </OnboardingStack.Screen>
    </OnboardingStack.Navigator>
  );
}

// Group 2: Idea Upload Navigator
function IdeaUploadNavigator() {
  return (
    <IdeaUploadStack.Navigator screenOptions={{ headerShown: false }}>
      <IdeaUploadStack.Screen name="IdeaEntry">
        {({ navigation }) => (
          <IdeaEntryScreen
            currentStep={1}
            totalSteps={5}
            onBackPress={() => navigation.goBack()}
            onSelectGitHub={() => navigation.navigate('GitHubConnect')}
            onSelectManual={() => navigation.navigate('VisibilitySettings', { ideaId: 'demo' })}
          />
        )}
      </IdeaUploadStack.Screen>
      <IdeaUploadStack.Screen name="GitHubConnect">
        {({ navigation }) => (
          <GitHubConnectScreen
            currentStep={2}
            totalSteps={5}
            onBackPress={() => navigation.goBack()}
            onConnectGitHub={async () => {}}
            onNext={() => navigation.navigate('RepoSelection')}
          />
        )}
      </IdeaUploadStack.Screen>
      <IdeaUploadStack.Screen name="RepoSelection">
        {({ navigation }) => (
          <RepoSelectionScreen
            currentStep={3}
            totalSteps={5}
            onBackPress={() => navigation.goBack()}
            onSelectRepo={() => navigation.navigate('AIScanLoading', { ideaId: 'demo' })}
          />
        )}
      </IdeaUploadStack.Screen>
      <IdeaUploadStack.Screen name="AIScanLoading">
        {({ navigation }) => (
          <AIScanLoadingScreen
            ideaId="demo"
            onScanComplete={() => navigation.navigate('AIScanResults', { ideaId: 'demo' })}
            onScanFailed={() => navigation.navigate('MissingGaps', { ideaId: 'demo' })}
          />
        )}
      </IdeaUploadStack.Screen>
      <IdeaUploadStack.Screen name="AIScanResults">
        {({ navigation }) => (
          <AIScanResultsScreen
            currentStep={4}
            totalSteps={5}
            onBackPress={() => navigation.goBack()}
            onNext={() => navigation.navigate('VisibilitySettings', { ideaId: 'demo' })}
          />
        )}
      </IdeaUploadStack.Screen>
      <IdeaUploadStack.Screen name="MissingGaps">
        {({ navigation }) => (
          <MissingGapsScreen
            currentStep={4}
            totalSteps={5}
            onBackPress={() => navigation.goBack()}
            onNext={() => navigation.navigate('VisibilitySettings', { ideaId: 'demo' })}
          />
        )}
      </IdeaUploadStack.Screen>
      <IdeaUploadStack.Screen name="VisibilitySettings">
        {({ navigation }) => (
          <VisibilitySettingsScreen
            currentStep={5}
            totalSteps={5}
            onBackPress={() => navigation.goBack()}
            onNext={() => navigation.navigate('PublishConfirmation', { ideaId: 'demo' })}
          />
        )}
      </IdeaUploadStack.Screen>
      <IdeaUploadStack.Screen name="PublishConfirmation">
        {({ navigation }: any) => (
          <PublishConfirmationScreen
            onViewMatches={() => navigation.replace('MainApp', { screen: 'HomeTab' })}
          />
        )}
      </IdeaUploadStack.Screen>
    </IdeaUploadStack.Navigator>
  );
}

// Group 3: Matches Navigator
function MatchesNavigator() {
  return (
    <MatchesStack.Navigator screenOptions={{ headerShown: false }}>
      <MatchesStack.Screen name="MatchesFeed">
        {({ navigation }) => (
          <MatchesFeedScreen
            ideaId="demo"
            activeTab="home"
            onTabPress={() => {}}
            onCandidatePress={() => navigation.navigate('CandidateProfile', { candidateId: 'demo' })}
          />
        )}
      </MatchesStack.Screen>
      <MatchesStack.Screen name="MyIdeas">
        {({ navigation }) => (
          <MyIdeasScreen
            onCreateNewIdea={() => (navigation.getParent())?.navigate('IdeaUpload')}
            onSelectIdeaMatches={() => navigation.navigate('MatchesFeed')}
            onToggleVisibility={() => {}}
          />
        )}
      </MatchesStack.Screen>
      <MatchesStack.Screen name="CandidateProfile">
        {({ navigation }) => (
          <CandidateProfileScreen
            onBackPress={() => navigation.goBack()}
            onRequestIntro={() => navigation.navigate('MatchIntroModal', { matchId: 'm1' })}
            onViewDeepDive={() => navigation.navigate('DeepDiveReport', { matchId: 'm1' })}
          />
        )}
      </MatchesStack.Screen>
      <MatchesStack.Screen name="MatchIntroModal">
        {({ navigation }) => (
          <MatchIntroModalScreen
            onBackPress={() => navigation.goBack()}
            onSendIntro={async () => { navigation.navigate('DeepDiveReport', { matchId: 'm1' }); }}
            onScheduleNFC={() => navigation.navigate('Handshake', { screen: 'ScheduleMeeting' })}
          />
        )}
      </MatchesStack.Screen>
      <MatchesStack.Screen name="DeepDiveReport">
        {({ navigation }: any) => (
          <DeepDiveReportScreen
            onBackPress={() => navigation.goBack()}
            onInitiateHandshake={() => navigation.navigate('Handshake', { screen: 'ScheduleMeeting' })}
          />
        )}
      </MatchesStack.Screen>
    </MatchesStack.Navigator>
  );
}

// Group 4: Handshake Navigator
function HandshakeNavigator() {
  return (
    <HandshakeStack.Navigator screenOptions={{ headerShown: false }}>
      <HandshakeStack.Screen name="ScheduleMeeting">
        {({ navigation }) => (
          <ScheduleMeetingScreen
            onBackPress={() => navigation.goBack()}
            onScheduleConfirm={async () => { navigation.navigate('NFCPreparation'); }}
          />
        )}
      </HandshakeStack.Screen>
      <HandshakeStack.Screen name="MeetingFeedback">
        {({ navigation }) => (
          <MeetingFeedbackScreen
            partnerName="אלון מזרחי"
            onBackPress={() => navigation.goBack()}
            onSubmitFeedback={async () => { navigation.navigate('NFCPreparation'); }}
            onProceedToNFC={() => navigation.navigate('NFCPreparation')}
          />
        )}
      </HandshakeStack.Screen>
      <HandshakeStack.Screen name="NFCPreparation">
        {({ navigation }) => (
          <NFCPreparationScreen
            onBackPress={() => navigation.goBack()}
            onStartTap={() => navigation.navigate('NFCHandshake')}
          />
        )}
      </HandshakeStack.Screen>
      <HandshakeStack.Screen name="NFCHandshake">
        {({ navigation }) => (
          <NFCHandshakeScreen
            matchId="m1"
            partnerName="אלון מזרחי"
            onBackPress={() => navigation.goBack()}
            onHandshakeSuccess={() => navigation.navigate('NFCSuccess')}
          />
        )}
      </HandshakeStack.Screen>
      <HandshakeStack.Screen name="NFCSuccess">
        {({ navigation }: any) => (
          <NFCSuccessScreen
            partnerName="אלון מזרחי"
            permissionsGranted={['code_repo', 'contact_info']}
            onOpenWorkspace={() => navigation.replace('WorkspaceFlow', { screen: 'WorkspaceOverview', params: { workspaceId: 'demo' } })}
          />
        )}
      </HandshakeStack.Screen>
      <HandshakeStack.Screen name="NFCTimeoutError">
        {({ navigation }) => (
          <NFCTimeoutErrorScreen
            onRetry={() => navigation.navigate('NFCHandshake')}
            onCancel={() => navigation.goBack()}
          />
        )}
      </HandshakeStack.Screen>
    </HandshakeStack.Navigator>
  );
}

// Group 5: Messaging & Settings Stack
function Group5Navigator() {
  return (
    <Group5Stack.Navigator screenOptions={{ headerShown: false }}>
      <Group5Stack.Screen name="ChatConversation">
        {({ navigation }) => (
          <ChatConversationScreen
            onBackPress={() => navigation.goBack()}
            onSendMessage={() => {}}
          />
        )}
      </Group5Stack.Screen>
      <Group5Stack.Screen name="IdeaSearch">
        {({ navigation }) => (
          <IdeaSearchScreen
            onBackPress={() => navigation.goBack()}
            onSearchSubmit={() => {}}
          />
        )}
      </Group5Stack.Screen>
      <Group5Stack.Screen name="PublicIdeaDetails">
        {({ navigation }) => (
          <PublicIdeaDetailsScreen
            onBackPress={() => navigation.goBack()}
            onRequestContact={() => {}}
          />
        )}
      </Group5Stack.Screen>
      <Group5Stack.Screen name="EditProfile">
        {({ navigation }) => (
          <EditProfileScreen
            onBackPress={() => navigation.goBack()}
            onSaveProfile={async () => { navigation.goBack(); }}
          />
        )}
      </Group5Stack.Screen>
      <Group5Stack.Screen name="Settings">
        {({ navigation }) => (
          <SettingsScreen
            onBackPress={() => navigation.goBack()}
            onLogout={() => navigation.replace('Onboarding')}
          />
        )}
      </Group5Stack.Screen>
      <Group5Stack.Screen name="Notifications">
        {({ navigation }) => (
          <NotificationsScreen
            onBackPress={() => navigation.goBack()}
            onSelectNotification={() => {}}
          />
        )}
      </Group5Stack.Screen>
    </Group5Stack.Navigator>
  );
}

// Group 6: Workspace Navigator
function WorkspaceNavigator() {
  return (
    <WorkspaceStack.Navigator screenOptions={{ headerShown: false }}>
      <WorkspaceStack.Screen name="Partnerships">
        {({ navigation }) => (
          <PartnershipsScreen
            onSelectPartnership={(wsId) => navigation.navigate('WorkspaceOverview', { workspaceId: wsId })}
            onNavigateTab={() => {}}
          />
        )}
      </WorkspaceStack.Screen>
      <WorkspaceStack.Screen name="WorkspaceOverview">
        {({ navigation }) => (
          <WorkspaceOverviewScreen
            onBackPress={() => navigation.goBack()}
            onNavigateSubTab={(tab) => {
              if (tab === 'idea_board') navigation.navigate('IdeaBoard', { workspaceId: 'demo' });
              if (tab === 'roadmap') navigation.navigate('Roadmap', { workspaceId: 'demo' });
              if (tab === 'decisions') navigation.navigate('DecisionLog', { workspaceId: 'demo' });
            }}
          />
        )}
      </WorkspaceStack.Screen>
      <WorkspaceStack.Screen name="IdeaBoard">
        {({ navigation }) => (
          <IdeaBoardScreen
            onBackPress={() => navigation.goBack()}
            onNavigateSubTab={(tab) => {
              if (tab === 'roadmap') navigation.navigate('Roadmap', { workspaceId: 'demo' });
              if (tab === 'decisions') navigation.navigate('DecisionLog', { workspaceId: 'demo' });
            }}
          />
        )}
      </WorkspaceStack.Screen>
      <WorkspaceStack.Screen name="Roadmap">
        {({ navigation }) => (
          <RoadmapScreen
            onBackPress={() => navigation.goBack()}
            onNavigateSubTab={(tab) => {
              if (tab === 'idea_board') navigation.navigate('IdeaBoard', { workspaceId: 'demo' });
              if (tab === 'decisions') navigation.navigate('DecisionLog', { workspaceId: 'demo' });
            }}
          />
        )}
      </WorkspaceStack.Screen>
      <WorkspaceStack.Screen name="DecisionLog">
        {({ navigation }) => (
          <DecisionLogScreen
            onBackPress={() => navigation.goBack()}
            onNavigateSubTab={(tab) => {
              if (tab === 'idea_board') navigation.navigate('IdeaBoard', { workspaceId: 'demo' });
              if (tab === 'roadmap') navigation.navigate('Roadmap', { workspaceId: 'demo' });
            }}
          />
        )}
      </WorkspaceStack.Screen>
      <WorkspaceStack.Screen name="EquityFramework">
        {({ navigation }) => (
          <EquityFrameworkScreen
            onBackPress={() => navigation.goBack()}
            onNavigateSubTab={(tab) => {
              if (tab === 'idea_board') navigation.navigate('IdeaBoard', { workspaceId: 'demo' });
              if (tab === 'roadmap') navigation.navigate('Roadmap', { workspaceId: 'demo' });
              if (tab === 'decisions') navigation.navigate('DecisionLog', { workspaceId: 'demo' });
            }}
          />
        )}
      </WorkspaceStack.Screen>
    </WorkspaceStack.Navigator>
  );
}

// Main Bottom Tab Navigator (Home, Public, Inbox, Workspace, Profile)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ navigation, state }: { navigation: any; state: any }) => {
        const routeName = state.routes[state.index]?.name;
        let activeTab: TabType = 'home';
        if (routeName === 'InboxTab') activeTab = 'inbox';
        if (routeName === 'WorkspaceTab') activeTab = 'partnerships';
        if (routeName === 'ProfileTab') activeTab = 'profile';

        const handleTabPress = (tab: TabType) => {
          if (tab === 'home') navigation.navigate('HomeTab', { screen: 'MatchesFeed' });
          if (tab === 'inbox') navigation.navigate('InboxTab');
          if (tab === 'partnerships') navigation.navigate('WorkspaceTab', { screen: 'Partnerships' });
          if (tab === 'profile') navigation.navigate('ProfileTab');
        };

        return <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />;
      }}
    >
      <Tab.Screen name="HomeTab" component={MatchesNavigator} />
      <Tab.Screen name="PublicTab">
        {({ navigation }: any) => (
          <PublicFeedScreen
            onSelectIdea={(id) => navigation.navigate('Group5Flow', { screen: 'PublicIdeaDetails', params: { ideaId: id } })}
            onOpenSearch={() => navigation.navigate('Group5Flow', { screen: 'IdeaSearch' })}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="InboxTab">
        {({ navigation }: any) => (
          <InboxScreen
            onSelectThread={(tId) => navigation.navigate('Group5Flow', { screen: 'ChatConversation', params: { threadId: tId } })}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="WorkspaceTab" component={WorkspaceNavigator} />
      <Tab.Screen name="ProfileTab">
        {({ navigation }: any) => (
          <UserProfileScreen
            onEditProfile={() => navigation.navigate('Group5Flow', { screen: 'EditProfile' })}
            onOpenSettings={() => navigation.navigate('Group5Flow', { screen: 'Settings' })}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Root Stack Navigator (Onboarding, MainApp, IdeaUpload, Handshake, Group5Flow, WorkspaceFlow)
export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      <Stack.Screen name="MainApp" component={MainTabNavigator} />
      <Stack.Screen name="IdeaUpload" component={IdeaUploadNavigator} />
      <Stack.Screen name="Handshake" component={HandshakeNavigator} />
      <Stack.Screen name="Group5Flow" component={Group5Navigator} />
      <Stack.Screen name="WorkspaceFlow" component={WorkspaceNavigator} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
