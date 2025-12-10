// client/src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './styles/LoginForm.scss';

const LoginForm: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (isRegister) {
                // Rejestracja
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Rejestracja udana. Zaloguj się.");
                setIsRegister(false); // Wracamy do logowania
            } else {
                // Logowanie
                await login(email, password);
                navigate('/'); // Przekierowanie na stronę główną po zalogowaniu
            }
        } catch (err: any) {
            console.error("Błąd uwierzytelniania:", err);
            // Wyświetlenie błędu specyficznego dla Firebase (np. hasło za słabe, email w użyciu)
            setError(err.message.replace('Firebase: Error (auth/', '').replace(').', ''));
        }
    };

    return (
        <div className="login-form-container">
            <h2>{isRegister ? 'Rejestracja' : 'Logowanie'}</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Hasło" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                {error && <p className="error-message">{error}</p>}
                
                <button type="submit">
                    {isRegister ? 'Zarejestruj' : 'Zaloguj'}
                </button>
            </form>
            
            <button 
                className="toggle-button" 
                onClick={() => setIsRegister(!isRegister)}
            >
                {isRegister ? 'Mam już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}
            </button>
        </div>
    );
};

export default LoginForm;