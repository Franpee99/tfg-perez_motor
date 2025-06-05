export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            src="/images/perez-motor/LOGO.png"
            alt="Pérez Motor"
            className={`object-contain ${className}`}
            style={{
                height: '110px',
                maxHeight: 'none',
                width: 'auto',
                maxWidth: 'none',
                display: 'block',
            }}
            {...props}
        />
    );
}
