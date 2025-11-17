export default function MessageNoAuth() {
    return (
      <div className="no-auth">
        <p>Треба авторизуватись, щоб зберігати історії</p>
  
        <div className="btns">
          <a href="/auth/login" className="btn">Увійти</a>
          <a href="/auth/register" className="btn">Зареєструватись</a>
        </div>
      </div>
    );
  }
  