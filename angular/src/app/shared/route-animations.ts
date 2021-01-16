import {
  style,
  trigger,
  transition,
  query,
  animateChild,
  group,
  animate,
} from '@angular/animations';

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
    query(':enter', [style({ [direction]: '-100%', opacity: 0 })], optional),
    query(':leave', animateChild(), optional),
    group([
      query(
        ':leave',
        [animate('400ms ease-in-out', style({ [direction]: '100%', opacity: 0 }))],
        optional,
      ),
      query(
        ':enter',
        [animate('400ms ease-in-out', style({ [direction]: '0%', opacity: 1 }))],
        optional,
      ),
    ]),
    query(':enter', animateChild(), optional),
  ];
};

const toRight = [
  '* => right',
  'top-left => top-right',
  'bottom-left => bottom-right',
  'bottom-left => bottom-right2',
  'bottom-right => bottom-right2',
];

const toLeft = [
  'right => *',
  'top-right => top-left',
  'bottom-right => bottom-left',
  'bottom-right2 => bottom-right',
  'bottom-right2 => bottom-left',
];

const toTop = ['bottom-right => top-left', 'bottom-left => top-left', 'bottom-right2 => top-left'];

const toBottom = ['top-left => bottom-left', 'top-right => bottom-left'];

export const slideAnimation = trigger('routeAnimations', [
  transition(toRight.join(', '), slideTo('right')),
  transition(toLeft.join(', '), slideTo('left')),
  transition(toBottom.join(', '), slideTo('bottom')),
  transition(toTop.join(', '), slideTo('top')),
]);
