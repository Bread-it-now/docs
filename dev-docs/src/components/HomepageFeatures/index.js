import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: (
      <>
        빵잇나우에서 갓 구운 빵을 <br /> 가장 신선할 때 만나세요!
      </>
    ),
    Svg: require('@site/static/img/breaditnow.svg').default,
    description: (
      <>
        동네 빵집의 빵을 더 쉽고 편리하게 구매하세요.
      </>
    ),
  },
  {
    title: (
      <>
        따끈한 빵이 나오는 순간, <br /> 바로 알려드릴게요!
      </>
    ),
    Svg: require('@site/static/img/breaditnow_notification.svg').default,
    description: (
      <>
        갓 나온 빵, 기다리지 말고 알림으로 먼저 받아보세요.
      </>
    ),
  },
  {
    title: (
      <>
        먹고 싶은 빵, 미리 예약하고 <br /> 편하게 픽업하세요!
      </>
    ),
    Svg: require('@site/static/img/breaditnow_reservation.svg').default,
    description: (
      <>
        원하는 빵을 예약하고 기다림 없이 즐기세요.
      </>
    ),
  }
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3" className={styles.title}>{title}</Heading>
        <p className={styles.description}>{description}</p>
      </div>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
