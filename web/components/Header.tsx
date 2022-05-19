import Link from 'next/link';

const HeaderComponent = () => {
    return (
        <header className="fixed w-full">
            <div className="main flex align-center">
                <span className="text-3xl font-bold">
                    <Link href="/">
                        <a>
                            <p className="p-2">
                            YesGada
                            </p>
                        </a>
                    </Link>
                </span>
                <span className="grow">
                    a
                </span>
                <span>
                    a
                </span>
            </div>
        </header>
    );
};

export default HeaderComponent;