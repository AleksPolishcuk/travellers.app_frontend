'use client';
import { useEffect, useState } from "react";
import TravellerInfo from "../../../components/TravellersInfo";
import TravellersStories from "../../../components/TravellersStories";
import styles from './ProfilePage.module.css';
import { getUserStories, getSavedStories} from "@/lib/api/clientApi";

interface ProfilePageProps {
    userId: string;
}


const ProfilePage = ({userId}: ProfilePageProps) => {

const [activeTab, setActiveTab] = useState<"saved" | "my">("saved");
const [stories, setStories] = useState([]);
const [loading, setLoading] = useState(true);

const fetchStories = async () => {
    setLoading(true);
try{
if (activeTab === "saved"){
    const response = await getSavedStories(userId);
    setStories(response?.data ?? []);
} else {
    const response = await getUserStories(userId);
    setStories(response?.data ?? []);
}
}catch (err){
console.error("Error fetching traveller stories:", err);
setStories([]);
}finally {
    setLoading(false);
}
};

useEffect(() => {
    fetchStories();
}, [activeTab, userId])
return (
    <section className={styles.profilePage}>
        <TravellerInfo userId={userId} />
        <div className={styles.switcher}>
        <button className={`${styles.tab} ${activeTab === "saved" ? styles.active : ""}`} onClick={() => setActiveTab("saved")}>Збережені історії</button>
        <button className={`${styles.tab} ${activeTab === "my" ? styles.active : ""}`} onClick={() => setActiveTab("my")}>Мої історії</button>
        </div>
        <TravellersStories stories={stories} loading={loading} />

    </section>
)
}

export default ProfilePage;