"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import { SignInIcon } from "@/icons";
import { Button, LinkButton } from "@/primitives/Button";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

interface FeatureProps extends Omit<ComponentProps<"div">, "title"> {
    description: ReactNode;
    title: ReactNode;
}


export default function Index() {
    const router = useRouter();

    const handleRedirect = () => {
        router.push("/persona");
    };

    return (
        <div>
            <Container className={styles.section}>
                <div className={styles.heroInfo}>
                    <h1 className={styles.heroTitle}>Think MeLet</h1>
                    <p className={styles.heroLead}>
                        An application to foster innovation
                    </p>
                    <p className={styles.heroLead}>
                        in the great St. Gallen region!
                    </p>
                </div>
                <div className={styles.heroActions}>
                    <Button icon={<SignInIcon />} onClick={handleRedirect}>
                        Sign in
                    </Button>
                    <LinkButton
                        href="https://liveblocks.io/docs/guides/nextjs-starter-kit"
                        target="_blank"
                        variant="secondary"
                    >
                        Learn more
                    </LinkButton>
                    <svg
                        src="..app/icons/LMT.svg"
                        alt="LMT Logo"
                        style={{ width: "50px", height: "auto" }}
                    />
                </div>
            </Container>
        </div>
    );
}
