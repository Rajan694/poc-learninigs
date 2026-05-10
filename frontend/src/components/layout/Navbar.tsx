import { BiMenu, BiLogOut, BiUser } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logoutSuccess } from '../../store/slices/authSlice';
import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    dispatch(logoutSuccess());
    navigate('/auth');
  };

  return (
    <header className="glass sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <BiMenu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          FinTask
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            <BiUser />
          </div>
          <span className="text-sm font-medium text-slate-700">{user?.name || 'User'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-rose-600 transition-colors p-2"
          title="Logout"
        >
          <BiLogOut className="h-5 w-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
