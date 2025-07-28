import { itensSideBar } from "@/utils/itensSideBar";
import styles from "@/styles/sideBar.module.css";

export default function Sidebar() {
    return (
        <ul className={styles.sidebar}>
            {itensSideBar.map((item) => (
                <li key={item.id}>
                    <a href="" className={styles.itensSideBar}>{item.name}</a>
                </li>
            ))}
        </ul>
    );
}