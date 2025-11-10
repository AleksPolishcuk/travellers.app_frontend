import AuthForm from '@/app/components/AuthForm/AuthForm';

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <AuthForm initialTab="sign-up" />
    </div>
  );
}