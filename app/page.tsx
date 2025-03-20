import clsx from "clsx";
import { redirect } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import { auth, signIn } from "@/auth";
import { SignInIcon } from "@/icons";
import { Button, LinkButton } from "@/primitives/Button";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

interface FeatureProps extends Omit<ComponentProps<"div">, "title"> {
    description: ReactNode;
    title: ReactNode;
}

function Feature({ title, description, className, ...props }: FeatureProps) {
    return (
        <div className={clsx(className, styles.featuresFeature)} {...props}>
            <h4 className={styles.featuresFeatureTitle}>{title}</h4>
            <p className={styles.featuresFeatureDescription}>{description}</p>
        </div>
    );
}

export default async function Index() {
    const session = await auth();

    // If logged in, go to dashboard
    if (session) {
        redirect("/persona");
    }

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
                    <form
                        action={async () => {
                            "use server";
                            await signIn({ callbackUrl: "/persona" });
                        }}
                    >
                        <Button icon={<SignInIcon />}>Sign in</Button>
                    </form>
                    <LinkButton
                        href="https://liveblocks.io/docs/guides/nextjs-starter-kit"
                        target="_blank"
                        variant="secondary"
                    >
                        Learn more
                    </LinkButton>
                </div>
            </Container>

        </div>
    );
}
