import { style, trigger, transition, query, animateChild, group, animate } from '@angular/animations';

const slideTo = (direction: string) => {
  const optional = { optional: true };
  return [
    style({ position: 'relative', overflow: 'hidden' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          overflow: 'hidden',
          [direction]: 0,
          width: '100%',
          height: '100%',
        }),
      ],
      optional,
    ),
    query(':enter', [style({ [direction]: '-100%', opacity: 0 })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('400ms ease-in-out', style({ [direction]: '100%', opacity: 0 }))]),
      query(':enter', [animate('400ms ease-in-out', style({ [direction]: '0%', opacity: 1 }))]),
    ]),
    query(':enter', animateChild()),
  ];
};

export const slideAnimation = trigger('routeAnimations', [
  transition('top-left => top-right, bottom-left => bottom-right', slideTo('right')),
  transition('top-right => top-left, bottom-right => bottom-left', slideTo('left')),
  transition('top-left => bottom-left, top-right => bottom-left', slideTo('bottom')),
  transition('bottom-right => top-left, bottom-left => top-left', slideTo('top')),
]);
