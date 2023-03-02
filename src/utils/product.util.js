import { Reader } from '@maxmind/geoip2-node';
import { object } from 'joi';
import Analytics from '../database/model/productAnalytic.model';
import User from '../database/model/user.model';
/**
 *
 * @param {*} userAgent
 * @returns Os
 */
export const getRequestOs = (userAgent = {}) => {
  if (userAgent.isDesktop) {
    return 'Desktop';
  }
  if (userAgent.isAndroid) {
    return 'AndroidOS';
  }
  if (userAgent.isMobile && userAgent.os === 'OS X') {
    return 'iOs';
  }
  return 'Others';
};

/**
 *
 * @param {Request} req
 * @param {*} product
 *
 * @returns {Promise<any>}
 */
export const createAnalytics = async (req, product) => {
  const { analyticType = 'visit' } = req.query;
  const reader = await Reader.open(process.env.GEOIP_PATH);
  let ipAddress = process.env.TEST_IP;
  if (process.env.NODE_ENV === 'production') {
    ipAddress = req.ip;
  }
  const city = reader.city(ipAddress);
  const device = {
    device: getRequestOs(req.useragent),
    country: city.country.names.en || 'Not specified',
    city: city?.location?.timeZone || 'Not specified',
    actionType: analyticType,
  };
  const analyticBody = {
    product,
    customer: {
      id: product.customer._id,
      name: product.name,
    },
    analytics: [device],
  };
  const existingAnalytic = await Analytics.findOne({
    'product._id': product._id,
  });

  if (!existingAnalytic) {
    const newAnalytic = await Analytics.create(analyticBody);
    return newAnalytic;
  }
  const analyticIndex = existingAnalytic.analytics.findIndex(
    (a) => a.device === device.device,
  );
  if (analyticIndex >= 0) {
    existingAnalytic.analytics[analyticIndex].count += 1;
  } else {
    existingAnalytic.analytics.push({ device, count: 1 });
  }
  await Analytics.findOneAndUpdate(
    { 'product._id': product._id },
    { analytics: existingAnalytic.analytics },
  );
};

// const existingAnalytic = await Analytics.findOne({
//   'product._id': product._id,
// });
// if (!existingAnalytic) {
//   const newAnalytic = await Analytics.create(analyticBody);
//   console.log(newAnalytic, 'qwerty');
//   return newAnalytic;
// }
// const deviceIndex = existingAnalytic.analytics.findIndex(
//   (d) => d.device === device.device,
// );
// if (deviceIndex >= 0) {
//   existingAnalytic.analytics[deviceIndex].count += 1;
// } else {
//   existingAnalytic.analytics.push({ ...device, count: 1 });
// }
// await Analytics.findOneAndUpdate(
//   { 'product._id': product._id },
//   { analytics: existingAnalytic.analytics },
// );
// };

/**
 *
 * @param {*} analytics
 * @returns
 */
export const organizeAnalytics = (analytics = []) => {
  const organized = [];

  analytics.forEach((analytic) => {
    organized.push(analytic);
  });
  // const result = organized.reduce(
  //   (acc, obj) => {
  //     obj.analytics.forEach((analytic) => {
  //       if (analytic.actionType === 'visit') {
  //         acc.visit += 1;
  //       }
  //       if (analytic.device === 'desktop') {
  //         acc.desktop += 1;
  //       }
  //       if (analytic.device === 'android') {
  //         acc.android += 1;
  //       }
  //       if (analytic.device === 'ios') {
  //         acc.ios += 1;
  //       }
  //       console.log(analytic.country, 'qqqqqqqqqqqqqq');
  //       // if (analytic.country === ) {
  //       //   acc.country += 1;
  //       // }
  //     });
  //     return acc;
  //   },
  //   { visit: 0, desktop: 0, android: 0, ios: 0, country: 0 },
  // );

  // console.log(result, 'result');
  // console.log(organized, 'finalllllllll');
  return organized;

  //   console.log(organized, 'organized');
  //   console.log(analytic, 'analytic');
  //   organizedIndex = organized.findIndex((item) =>
  //     item._id.equals(analytic.product._id),
  //   );
  // });
  // console.log(organizedIndex, 'result');
  // const organized = analytics.forEach((analytic) => {
  // const organizedIndex = organized.findIndex((item) =>
  //   item.product._id.equals(analytic.product._id),
  // );

  // const androids = analytic.analytics.device === 'AndroidOS' ? 1 : 0;
  // const iOs = analytic.analytics.device === 'iOs' ? 1 : 0;
  // const desktops = analytic.analytics.device === 'Desktop' ? 1 : 0;
  // const clicks = analytic.analytics.actionType === 'click' ? 1 : 0;
  // const users = analytic.analytics.actionType === 'visit' ? 1 : 0;

  // if (organizedIndex < 0) {
  //   organized.push({
  //     ...analytic,
  //     countries: [{ name: analytic.country, count: 1 }],
  //     users,
  //     androids,
  //     iOs,
  //     desktops,
  //     clicks,
  //   });
  // } else {
  //   organized[organizedIndex].users += users;
  //   organized[organizedIndex].androids += androids;
  //   organized[organizedIndex].iOs += iOs;
  //   organized[organizedIndex].desktops += desktops;
  //   organized[organizedIndex].clicks += clicks;
  //   const countryIndex = organized[
  //     organizedIndex
  //   ].countries.findIndex((el) => el.name === analytic.country);
  //   if (countryIndex >= 0) {
  //     organized[organizedIndex].countries[countryIndex].count += 1;
  //   } else if (organized[organizedIndex].countries.length < 4) {
  //     organized[organizedIndex].countries.push({
  //       name: analytic.country,
  //       count: 1,
  //     });
  //   }
  // }
  // });
  // return analytics;
};
