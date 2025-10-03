import { type MotionProps, motion } from "motion/react";
import type { HTMLAttributes, ReactNode } from "react";

type MotionDivProps = MotionProps &
	HTMLAttributes<HTMLDivElement> & {
		children: ReactNode;
	};

export function MotionDiv({ children, ...props }: MotionDivProps) {
	return <motion.div {...props}>{children}</motion.div>;
}
