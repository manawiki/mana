import type {
   ReactNode,
   KeyboardEventHandler,
   PointerEventHandler,
   TouchEventHandler,
   FocusEventHandler,
   MouseEventHandler,
} from "react";
import { forwardRef } from "react";

type Props = {
   children: ReactNode;
   onClick?: MouseEventHandler<HTMLButtonElement>;
   onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
   onPointerEnter?: PointerEventHandler<HTMLButtonElement>;
   onPointerLeave?: PointerEventHandler<HTMLButtonElement>;
   onPointerDown?: PointerEventHandler<HTMLButtonElement>;
   onFocus?: FocusEventHandler<HTMLButtonElement>;
   onBlur?: FocusEventHandler<HTMLButtonElement>;
   onTouchStart?: TouchEventHandler<HTMLButtonElement>;
   ariaLabel?: string;
   type?: "submit" | "reset" | "button";
   className?: string;
};

const Button = forwardRef<HTMLButtonElement, Props>(
   (
      {
         children,
         onClick,
         onKeyDown,
         onPointerEnter,
         onPointerLeave,
         onPointerDown,
         onFocus,
         onBlur,
         onTouchStart,
         ariaLabel,
         className,
         type,
      },
      ref
   ) => {
      return (
         <button
            ref={ref}
            className={className}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onFocus={onFocus}
            onBlur={onBlur}
            onPointerDown={onPointerDown}
            onTouchStart={onTouchStart}
            aria-label={ariaLabel}
            type={type}
         >
            {children}
         </button>
      );
   }
);

Button.displayName = "Button";

export default Button;
