"use client"
import { useAuthStore } from '@/store/authStore';
import css from './Join.module.css'
import Link from 'next/link';

function Join(){

    const {isAuthenticated} = useAuthStore();
    return (
        <section id='join' className={css.container}>
            <div className={css.backgroundJoin}>
                <div className={css.wrapper}>
                    <h2 className={css.headerJoin}>Приєднуйтесь до нашої спільноти</h2>
                    <p className={css.infoText}>Долучайтеся до мандрівників, які діляться своїми історіями та надихають на нові пригоди.</p>
                    <Link href={isAuthenticated ? "/auth/profile" : '/auth/register'}><button className={css.registerButton} type="button">{isAuthenticated ? 'Збережені історії' : 'Зареєструватися'}</button></Link>
                </div>
            </div>
        </section>
    )
}


export default Join;