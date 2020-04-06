declare var anime: any;

export function main() {
    const btn = document.querySelector('.btn');
    const closed = document.querySelector('.slider__close');
    const title: any = document.querySelector('.hero h2.h1');

    btn.addEventListener(
        'click',
        (_) => {
            anime({
                targets: document.querySelector('.slider'),
                translateX: '0%',
                elasticity: 200,
            });
            anime({
                delay: 750,
                targets: document.querySelector('.js-slider-skills'),
                translateY: ['50px', '0'],
                opacity: 1,
                elasticity: 200,
                complete: () => {
                    anime({
                        targets: document.querySelectorAll(
                            '.js-slider-content',
                        ),
                        translateY: ['50px', '0'],
                        opacity: 1,
                        elasticity: 200,
                    });
                },
            });
        },
        false,
    );

    closed.addEventListener(
        'click',
        (_) => {
            anime({
                targets: document.querySelector('.slider'),
                translateX: '-200%',
            });

            anime({
                targets: document.querySelector('.js-slider-skills'),
                translateY: '50px',
                opacity: 0,
            });

            anime({
                targets: document.querySelectorAll('.js-slider-content'),
                translateY: '50px',
                opacity: 0,
            });
        },
        false,
    );

    const STEP = (e: MouseEvent) => {
        let x = (e.pageX - window.innerWidth / 2) / 120;
        let y = (e.pageY - window.innerHeight / 2) / 90;

        requestAnimationFrame(() => {
            title.style.textShadow = `${
                x * 7
            }px ${y}px 0px rgba(255, 255, 255, 1)`;
        });
    };

    document.addEventListener(
        'mousemove',
        (e) => {
            STEP(e);
        },
        false,
    );
}
