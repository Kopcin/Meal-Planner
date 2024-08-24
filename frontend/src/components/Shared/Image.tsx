interface ImageProps {
    src: string;
    alt: string;
    className?: string;
  }

  export default function Image (): React.FC<ImageProps> = ({ src, alt, className, ...props }) => {
    return (
      <img
        src={src}
        alt={alt}
        className={`${styles.image} ${className}`}
        {...props}
      />
    );
  };
  
  export default Image;