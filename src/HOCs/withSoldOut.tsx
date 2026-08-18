import type { ComponentType } from "react";
import styles from "./withSoldOut.module.css";

type SoldOutProps = {
  soldOut?: boolean;
};

function withSoldOut<P extends object>(WrappedComponent: ComponentType<P>) {
  return ({ soldOut = false, ...props }: P & SoldOutProps) => {
    return soldOut ? (
      <div className={styles.grayOverlay}>
        <WrappedComponent {...(props as P)} />
      </div>
    ) : (
      <WrappedComponent {...(props as P)} />
    );
  };
}

export default withSoldOut;
