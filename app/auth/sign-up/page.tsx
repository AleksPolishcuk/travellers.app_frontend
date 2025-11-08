import AuthForm from '@/app/components/AuthForm/AuthForm';
import RegisterForm from '@/app/components/AuthForm/RegistrationForm';

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <AuthForm initialTab="sign-up" />
    </div>
  );
}