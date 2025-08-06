import { useNavigate } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import {
  disconnectCongAccount,
  setIsAboutOpen,
  setIsContactOpen,
  setIsSupportOpen,
  setIsUserSignIn,
  displaySnackNotification,
} from '@services/states/app';
import { useBreakpoints } from '@hooks/index';
import {
  congAccountConnectedState,
  isAppLoadState,
  navBarAnchorElState,
} from '@states/app';
import {
  accountTypeState,
  congNameState,
  fullnameState,
} from '@states/settings';
import { userSignOut } from '@services/firebase/auth';
import { authProvider } from '@services/firebase/auth';
import { currentAuthUser, userSignInPopup } from '@services/firebase/auth';

const useNavbar = () => {
  const navigate = useNavigate();

  const { laptopUp, tabletDown, tabletUp } = useBreakpoints();

  const [anchorEl, setAnchorEl] = useAtom(navBarAnchorElState);

  const fullname = useAtomValue(fullnameState);
  const congName = useAtomValue(congNameState);
  const isCongAccountConnected = useAtomValue(congAccountConnectedState);
  const isAppLoad = useAtomValue(isAppLoadState);
  const accountType = useAtomValue(accountTypeState);

  const openMore = Boolean(anchorEl);

  const handleOpenMoreMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorEl(null);
  };

  const handleGoDashboard = () => {
    navigate('/');
  };

  const handleOpenMyProfile = () => {
    handleCloseMore();
    navigate(`/user-profile`);
  };

  const handleReconnectAccount = async () => {
    handleCloseMore();

    try {
      const user = currentAuthUser();
      
      if (!user) {
        // If no user is signed in, show the sign-in form
        setIsUserSignIn(true);
        return;
      }

      // Get the provider ID used for the original sign-in
      const providerId = user.providerData[0]?.providerId;
      
      // Handle email/password login
      if (providerId === 'password') {
        // For email login, show the sign-in form
        setIsUserSignIn(true);
        return;
      }
      
      // Handle Google OAuth
      if (providerId === 'google.com') {
        await userSignInPopup(authProvider.Google);
        return;
      }

      // If we get here, the provider is not supported
      console.error('Unsupported provider:', providerId);
      throw new Error('Unsupported authentication provider');
      
    } catch (error) {
      console.error('Reauthentication failed:', error);
      displaySnackNotification({
        header: 'Reauthentication Failed',
        message: 'Failed to reconnect your account. Please try again or sign in manually.',
        severity: 'error',
      });
      // Show the sign-in form as fallback
      setIsUserSignIn(true);
    }
  };

  const handleOpenContact = async () => {
    handleCloseMore();
    setIsContactOpen(true);
  };

  const handleOpenAbout = () => {
    handleCloseMore();
    setIsAboutOpen(true);
  };

  const handleOpenSupport = () => {
    handleCloseMore();
    setIsSupportOpen(true);
  };

  const handleOpenDoc = () => {
    handleCloseMore();
    window.open(`https://guide.organized-app.com`, '_blank');
  };

  const handleOpenRealApp = () => {
    handleCloseMore();
    window.open(`https://organized-app.com`, '_blank');
  };

  const handleDisonnectAccount = async () => {
    handleCloseMore();

    await userSignOut();
    disconnectCongAccount();

    location.reload();
  };

  return {
    openMore,
    handleOpenMoreMenu,
    handleCloseMore,
    anchorEl,
    handleOpenContact,
    handleOpenAbout,
    handleOpenSupport,
    handleOpenDoc,
    fullname,
    congName,
    tabletUp,
    laptopUp,
    tabletDown,
    isCongAccountConnected,
    handleOpenMyProfile,
    handleGoDashboard,
    isAppLoad,
    handleReconnectAccount,
    handleOpenRealApp,
    accountType,
    handleDisonnectAccount,
  };
};

export default useNavbar;
