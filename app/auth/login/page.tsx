import AuthForm from '@/app/components/AuthForm/AuthForm';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <AuthForm initialTab="login" />
    </div>
  );
}