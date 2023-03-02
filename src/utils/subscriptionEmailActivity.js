export const subscriptionEmail = (user = {}, data = {}) => {
  return `<body style="margin: 0; padding: 0">
    <table
      style="
        padding: 0;
        border-spacing: 0;
        border: 0;
        border-collapse: collapse;
        background-color: #f1f1f1;
      "
      width="100%"
      height="100%"
      valign="top"
      align="left"
    >
      <tbody>
        <tr
          style="padding: 0; vertical-align: top; text-align: left"
          valign="top"
          align="left"
        >
          <td class="" align="center" valign="top">
            <center style="width: 100%">
              <table
                class="body"
                style="
                  border-spacing: 0;
                  border-collapse: collapse;
                  padding: 0;
                  margin: 0;
                  vertical-align: top;
                  width: 100%;
                  text-align: inherit;
                "
                width="100%"
                valign="top"
                align="inherit"
              >
                <tbody>
                  <tr
                    style="background-color: #8967fc; width: 100%"
                    valign="top"
                    align="left"
                  >
                    <td
                      style="word-break: break-word; vertical-align: top"
                      valign="top"
                      align="left"
                    >
                      <div class="header" style="display: block">
                        <img
                          class="ari-logo"
                          src="https://i.ibb.co/S5znLWj/ARIemaillogo.png"
                          alt="ARI Logo"
                          title="ARI Logo"
                          style="
                            outline: none;
                            text-decoration: none;
                            max-height: 60px;
                            max-width: 350px;
                            display: block;
                            margin: 0 auto;
                            float: none;
                          "
                          data-bit="iit"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                class=""
                style="
                  border-spacing: 0;
                  border-collapse: collapse;
                  border-radius: 0.5em;
                  margin-top: 2em;
                  background-color: #fff;
                  width: 80%;
                  margin-bottom: 2em;
                  text-align: inherit;
                "
                valign="top"
                align="inherit"
              >
                <tbody>
                  <tr
                    style="padding: 0; vertical-align: top; text-align: left"
                    valign="top"
                    align="left"
                  >
                    <td
                      style="
                        word-break: break-word;
                        vertical-align: top;
                        color: #172b4d;
                        font-weight: normal;
                        margin: 0;
                        text-align: left;
                        font-size: 14px;
                        line-height: 19px;
                          
                        padding: 16px 0;
                        border-collapse: collapse;
                      "
                      valign="top"
                      align="left"
                    >
                      <div
                        class="m_4623704808790991326trello-block-single-column"
                        style="
                          display: block;
                          margin: 0 auto;
                          max-width: 580px;
                          padding: 12px 16px;
                        "
                      >
                        <table
                          width="100%"
                          class=""
                          style="
                            border-spacing: 0;
                            border-collapse: collapse;
                            padding: 0;
                            vertical-align: top;
                            text-align: left;
                            margin: 12px 0;
                            float: left;
                            clear: both;
                          "
                          valign="top"
                          align="left"
                        >
                          <tbody>
                            <tr
                              style="
                                padding: 0;
                                vertical-align: top;
                                text-align: left;
                              "
                              valign="top"
                              align="left"
                            >
                              <td
                                class="m_4623704808790991326phenom-details"
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  color: #172b4d;
                                  font-weight: normal;
                                  text-align: left;
                                  line-height: 30px;
                                  font-size: 14px;
                                    
                                  border-collapse: collapse;
                                "
                                valign="top"
                                align="left"
                              >
                                Hey ${user.firstName},
                              </td>
                            </tr>
                            <tr
                              style="
                                padding-top: 0;
                                vertical-align: top;
                                text-align: left;
                              "
                              valign="top"
                              align="left"
                            >
                              <td
                                class=""
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  color: #172b4d;
                                  font-weight: normal;
                                  text-align: left;
                                  font-size: 14px;
                                  line-height: 30px;
                                    
                                  border-collapse: collapse;
                                "
                                valign="top"
                                align="left"
                              >
                                Thank you for choosing Augmented Reality Innovations!
                              </td>
                            </tr>
                            <tr
                              style="
                                padding-top: 0;
                                vertical-align: top;
                                text-align: left;
                              "
                              valign="top"
                              align="left"
                            >
                              <td
                                class=""
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  color: #172b4d;
                                  font-weight: normal;
                                  text-align: left;
                                  font-size: 14px;
                                  line-height: 30px;
                                    
                                  border-collapse: collapse;
                                "
                                valign="top"
                                align="left"
                              >
                                Just a friendly reminder that your ${data?.subscriptionPlanId?.SubscriptionPlanName} subscription will automaticatically renew in 30 days
                              </td>
                            </tr>
                            <tr
                              style="
                                padding-top: 0;
                                vertical-align: top;
                                text-align: left;
                              "
                              valign="top"
                              align="left"
                            >
                              <td
                                class=""
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  color: #172b4d;
                                  font-weight: normal;
                                  text-align: left;
                                  font-size: 14px;
                                  line-height: 30px;
                                    
                                  border-collapse: collapse;
                                "
                                valign="top"
                                align="left"
                              >
                                Your subscription plan costs $${data?.subscriptionPlanId?.billingCycle[0]?.monthly} per ${data?.billingCycle}
                              </td>
                            </tr> 
                            <tr
                              style="
                                padding-top: 0;
                                vertical-align: top;
                                text-align: left;
                              "
                              valign="top"
                              align="left"
                            >
                              <td
                                class=""
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  color: #172b4d;
                                  font-weight: normal;
                                  text-align: left;
                                  font-size: 14px;
                                  line-height: 30px;
                                    
                                  border-collapse: collapse;
                                "
                                valign="top"
                                align="left"
                              >
                                <a
                                  target="_blank"
                                  href="${process.env.FRONTEND_URL}"
                                >
                                  Log in 
                                </a>
                                To your account
                              </td>
                            </tr>
                            <tr
                              style="
                                padding-top: 0;
                                vertical-align: top;
                                text-align: left;
                              "
                              valign="top"
                              align="left"
                            >
                              <td
                                class=""
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  color: #172b4d;
                                  font-weight: normal;
                                  text-align: left;
                                  font-size: 14px;
                                  line-height: 30px;
                                    
                                  border-collapse: collapse;
                                "
                                valign="top"
                                align="left"
                              >
                                To help us maintain consistent and uniterrupted service for you, please check if your payment method/billing information is still up to date:
                              </td>
                            </tr>
                            <tr
                              style="
                                padding-top: 0;
                                vertical-align: top;
                                text-align: left;
                              "
                              valign="top"
                              align="left"
                            >
                              <td
                                class=""
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  color: #172b4d;
                                  font-weight: normal;
                                  text-align: left;
                                  font-size: 14px;
                                  line-height: 30px;
                                    
                                  border-collapse: collapse;
                                "
                                valign="top"
                                align="left"
                              >
                                <ul>
                                  <li>Simply log in to your ARI account,</li>
                                  <li>Click subscription icon in the left-hand menu</li>
                                  <li>Select the "Current Plan" or "Available Plan" tab</li>
                                  <li>Check/update your payment information</li>
                                </ul>
                              </td>
                            </tr>
                            <tr
                              style="
                                padding-top: 0;
                                vertical-align: top;
                                text-align: left;
                              "
                              valign="top"
                              align="left"
                            >
                              <td
                                class=""
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  color: #172b4d;
                                  font-weight: normal;
                                  text-align: left;
                                  font-size: 14px;
                                  line-height: 30px;
                                    
                                  border-collapse: collapse;
                                "
                                valign="top"
                                align="left"
                              >
                                If you need help with your ${data?.subscriptionPlanId?.SubscriptionPlanName} subscription, please contact us on our support page or reply to this email
                              </td>
                            </tr>
                            <tr
                              style="
                                padding-top: 0;
                                vertical-align: top;
                                text-align: left;
                              "
                              valign="top"
                              align="left"
                            >
                              <td
                                class=""
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  color: #172b4d;
                                  font-weight: normal;
                                  text-align: left;
                                  font-size: 14px;
                                  line-height: 30px;
                                    
                                  border-collapse: collapse;
                                "
                                valign="top"
                                align="left"
                              >
                                Thanks,
                              </td>
                            </tr>
                            <tr
                              style="
                                padding-top: 0;
                                vertical-align: top;
                                text-align: left;
                              "
                              valign="top"
                              align="left"
                            >
                              <td
                                class=""
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  color: #172b4d;
                                  font-weight: normal;
                                  text-align: left;
                                  font-size: 14px;
                                  line-height: 30px;
                                  border-collapse: collapse;
                                "
                                valign="top"
                                align="left"
                              >
                                ARI Team
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr
                    style="padding: 0; vertical-align: top; text-align: left"
                    valign="top"
                    align="left"
                  >
                    <td
                      style="
                        word-break: break-word;
                        vertical-align: top;
                        color: #172b4d;
                        font-weight: normal;
                        padding: 0;
                        margin: 0;
                        text-align: left;
                        font-size: 14px;
                        line-height: 19px;
                          
                        border-collapse: collapse;
                      "
                      valign="top"
                      align="left"
                    >
                      <div
                        class="m_4623704808790991326trello-block-single-column m_4623704808790991326center"
                        style="
                          display: block;
                          margin: 0 auto;
                          max-width: 150px;
                          border-radius: 5em;
                          padding: 12px 16px;
                          background-color: #8967fc;
                        "
                      >
                        <p
                          style="
                            color: #fff;
                            font-weight: bold;
                            padding: 0;
                            margin: 0;
                            font-size: 14px;
                            line-height: 19px;
                             
                            text-align: center;
                          "
                        >
                          <a
                            href="${process.env.FRONTEND_URL}"
                            style="color: #fff; text-decoration: none"
                            target="_blank"
                          >
                            Login
                          </a>
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr
                    style="padding: 0; vertical-align: top; text-align: left"
                    valign="top"
                    align="left"
                  >
                    <td
                      style="
                        word-break: break-word;
                        vertical-align: top;
                        color: #172b4d;
                        font-weight: normal;
                        padding: 0;
                        margin: 0;
                        text-align: left;
                        font-size: 14px;
                        line-height: 19px;
                          
                        border-collapse: collapse;
                      "
                      valign="top"
                      align="left"
                    >
                      <div
                        class=""
                        style="
                          display: block;
                          margin: 0 auto;
                          max-width: 580px;
                          padding: 12px 16px;
                        "
                      >
                        <p
                          style="
                            font-weight: normal;
                            padding: 0;
                            margin: 0;
                            font-size: 14px;
                            line-height: 19px;
                            margin-bottom: 10px;
                             
                            text-align: center;
                            color: #9b9b9b;
                          "
                        >
                          Augmented Reality Innovation
                        </p>
  
                        <p
                          style="
                            font-weight: normal;
                            padding: 0;
                            margin: 0;
                            font-size: 14px;
                            line-height: 19px;
                            margin-bottom: 10px;
                             
                            color: #9b9b9b;
                            text-align: center;
                          "
                        >
                          <a
                            href="https://dev.arinnovations.io "
                            style="
                              font-family: -apple-system, BlinkMacSystemFont,
                                Segoe UI, Roboto, Noto Sans, Ubuntu, Droid Sans,
                                Helvetica Neue, sans-serif;
                              color: #9b9b9b;
                              text-decoration: underline;
                            "
                            target="_blank"
                          >
                            www.arinnovations.io
                          </a>
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </center>
          </td>
        </tr>
      </tbody>
    </table>
  </body>`;
};

export const changeSubscriptionEmail = (
  user = {},
  newSubscription = {},
  oldSubscription = {},
) => {
  return `<body style="margin: 0; padding: 0">
  <table
    style="
      padding: 0;
      border-spacing: 0;
      border: 0;
      border-collapse: collapse;
      background-color: #f1f1f1;
    "
    width="100%"
    height="100%"
    valign="top"
    align="left"
  >
    <tbody>
      <tr
        style="padding: 0; vertical-align: top; text-align: left"
        valign="top"
        align="left"
      >
        <td class="" align="center" valign="top">
          <center style="width: 100%">
            <table
              class="body"
              style="
                border-spacing: 0;
                border-collapse: collapse;
                padding: 0;
                margin: 0;
                vertical-align: top;
                width: 100%;
                text-align: inherit;
              "
              width="100%"
              valign="top"
              align="inherit"
            >
              <tbody>
                <tr
                  style="background-color: #8967fc; width: 100%"
                  valign="top"
                  align="left"
                >
                  <td
                    style="
                      word-break: break-word;
                      vertical-align: top;
                    "
                    valign="top"
                    align="left"
                  >
                    <div class="header" style="display: block">
                      <img
                        class="ari-logo"
                        src="https://i.ibb.co/S5znLWj/ARIemaillogo.png"
                        alt="ARI Logo"
                        title="ARI Logo"
                        style="
                          outline: none;
                          text-decoration: none;
                          max-height: 60px;
                          max-width: 350px;
                          display: block;
                          margin: 0 auto;
                          float: none;
                        "
                        data-bit="iit"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class=""
              style="
                border-spacing: 0;
                border-collapse: collapse;
                border-radius: 0.5em;
                margin-top: 2em;
                background-color: #fff;
                width: 80%;
                margin-bottom: 2em;
                text-align: inherit;
              "
              valign="top"
              align="inherit"
            >
              <tbody>
                <tr
                  style="
                    padding: 0;
                    vertical-align: top;
                    text-align: left;
                  "
                  valign="top"
                  align="left"
                >
                  <td
                    style="
                      word-break: break-word;
                      vertical-align: top;
                      color: #172b4d;
                      font-weight: normal;
                      margin: 0;
                      text-align: left;
                      font-size: 14px;
                      line-height: 19px;

                      padding: 16px 0;
                      border-collapse: collapse;
                    "
                    valign="top"
                    align="left"
                  >
                    <div
                      class="m_4623704808790991326trello-block-single-column"
                      style="
                        display: block;
                        margin: 0 auto;
                        max-width: 580px;
                        padding: 12px 16px;
                      "
                    >
                      <table
                        width="100%"
                        class=""
                        style="
                          border-spacing: 0;
                          border-collapse: collapse;
                          padding: 0;
                          vertical-align: top;
                          text-align: left;
                          margin: 12px 0;
                          float: left;
                          clear: both;
                        "
                        valign="top"
                        align="left"
                      >
                        <tbody>
                          <tr
                            style="
                              padding: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class="m_4623704808790991326phenom-details"
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                line-height: 30px;
                                font-size: 14px;

                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              Hey ${user.firstName},
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;

                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              Thank you for choosing Augmented
                              Reality Innovations!
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;

                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              Just a friendly reminder that your
                              ${newSubscription?.subscriptionPlanId?.SubscriptionPlanName}
                              subscription is updated effective
                              immediately.
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;

                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              Your old subscription plan ${oldSubscription?.subscriptionPlanId?.SubscriptionPlanName}
                              was $${oldSubscription?.subscriptionPlanId?.billingCycle[0]?.monthly} per ${oldSubscription?.billingCycle}
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;

                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              Your new subscription plan ${oldSubscription?.subscriptionPlanId?.SubscriptionPlanName} is $${newSubscription?.subscriptionPlanId?.billingCycle[0]?.monthly} per ${newSubscription?.billingCycle}
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;

                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              If you need help with your
                              ${newSubscription?.subscriptionPlanId?.SubscriptionPlanName}
                              subscription, please contact us on our
                              support page or reply to this email
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;

                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              Thanks,
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;
                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              ARI Team
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
                <tr
                  style="
                    padding: 0;
                    vertical-align: top;
                    text-align: left;
                  "
                  valign="top"
                  align="left"
                >
                  <td
                    style="
                      word-break: break-word;
                      vertical-align: top;
                      color: #172b4d;
                      font-weight: normal;
                      padding: 0;
                      margin: 0;
                      text-align: left;
                      font-size: 14px;
                      line-height: 19px;

                      border-collapse: collapse;
                    "
                    valign="top"
                    align="left"
                  >
                    <div
                      class="m_4623704808790991326trello-block-single-column m_4623704808790991326center"
                      style="
                        display: block;
                        margin: 0 auto;
                        max-width: 150px;
                        border-radius: 5em;
                        padding: 12px 16px;
                        background-color: #8967fc;
                      "
                    >
                      <p
                        style="
                          color: #fff;
                          font-weight: bold;
                          padding: 0;
                          margin: 0;
                          font-size: 14px;
                          line-height: 19px;

                          text-align: center;
                        "
                      >
                        <a
                          href="${process.env.FRONTEND_URL}"
                          style="color: #fff; text-decoration: none"
                          target="_blank"
                        >
                          Login
                        </a>
                      </p>
                    </div>
                  </td>
                </tr>
                <tr
                  style="
                    padding: 0;
                    vertical-align: top;
                    text-align: left;
                  "
                  valign="top"
                  align="left"
                >
                  <td
                    style="
                      word-break: break-word;
                      vertical-align: top;
                      color: #172b4d;
                      font-weight: normal;
                      padding: 0;
                      margin: 0;
                      text-align: left;
                      font-size: 14px;
                      line-height: 19px;

                      border-collapse: collapse;
                    "
                    valign="top"
                    align="left"
                  >
                    <div
                      class=""
                      style="
                        display: block;
                        margin: 0 auto;
                        max-width: 580px;
                        padding: 12px 16px;
                      "
                    >
                      <p
                        style="
                          font-weight: normal;
                          padding: 0;
                          margin: 0;
                          font-size: 14px;
                          line-height: 19px;
                          margin-bottom: 10px;

                          text-align: center;
                          color: #9b9b9b;
                        "
                      >
                        Augmented Reality Innovation
                      </p>

                      <p
                        style="
                          font-weight: normal;
                          padding: 0;
                          margin: 0;
                          font-size: 14px;
                          line-height: 19px;
                          margin-bottom: 10px;

                          color: #9b9b9b;
                          text-align: center;
                        "
                      >
                        <a
                          href="https://dev.arinnovations.io "
                          style="
                            font-family: -apple-system,
                              BlinkMacSystemFont, Segoe UI, Roboto,
                              Noto Sans, Ubuntu, Droid Sans,
                              Helvetica Neue, sans-serif;
                            color: #9b9b9b;
                            text-decoration: underline;
                          "
                          target="_blank"
                        >
                          www.arinnovations.io
                        </a>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </td>
      </tr>
    </tbody>
  </table>
</body>`;
};

export const subscriptionEmailReminder = (data) => {
  return `<body style="margin: 0; padding: 0">
  <table
    style="
      padding: 0;
      border-spacing: 0;
      border: 0;
      border-collapse: collapse;
      background-color: #f1f1f1;
    "
    width="100%"
    height="100%"
    valign="top"
    align="left"
  >
    <tbody>
      <tr
        style="padding: 0; vertical-align: top; text-align: left"
        valign="top"
        align="left"
      >
        <td class="" align="center" valign="top">
          <center style="width: 100%">
            <table
              class="body"
              style="
                border-spacing: 0;
                border-collapse: collapse;
                padding: 0;
                margin: 0;
                vertical-align: top;
                width: 100%;
                text-align: inherit;
              "
              width="100%"
              valign="top"
              align="inherit"
            >
              <tbody>
                <tr
                  style="background-color: #8967fc; width: 100%"
                  valign="top"
                  align="left"
                >
                  <td
                    style="
                      word-break: break-word;
                      vertical-align: top;
                    "
                    valign="top"
                    align="left"
                  >
                    <div class="header" style="display: block">
                      <img
                        class="ari-logo"
                        src="https://i.ibb.co/S5znLWj/ARIemaillogo.png"
                        alt="ARI Logo"
                        title="ARI Logo"
                        style="
                          outline: none;
                          text-decoration: none;
                          max-height: 60px;
                          max-width: 350px;
                          display: block;
                          margin: 0 auto;
                          float: none;
                        "
                        data-bit="iit"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class=""
              style="
                border-spacing: 0;
                border-collapse: collapse;
                border-radius: 0.5em;
                margin-top: 2em;
                background-color: #fff;
                width: 60%;
                text-align: inherit;
              "
              valign="top"
              align="inherit"
            >
              <tbody>
                <tr
                  style="
                    padding: 0;
                    vertical-align: top;
                    text-align: left;
                  "
                  valign="top"
                  align="left"
                >
                  <td
                    style="
                      word-break: break-word;
                      vertical-align: top;
                      color: #172b4d;
                      font-weight: normal;
                      margin: 0;
                      text-align: left;
                      font-size: 14px;
                      line-height: 19px;

                      padding: 16px 0;
                      border-collapse: collapse;
                    "
                    valign="top"
                    align="left"
                  >
                    <div
                      class="m_4623704808790991326trello-block-single-column"
                      style="
                        display: block;
                        margin: 0 auto;
                        max-width: 580px;
                        padding: 12px 16px;
                      "
                    >
                      <table
                        width="100%"
                        class=""
                        style="
                          border-spacing: 0;
                          border-collapse: collapse;
                          padding: 0;
                          vertical-align: top;
                          text-align: left;
                          margin: 12px 0;
                          float: left;
                          clear: both;
                        "
                        valign="top"
                        align="left"
                      >
                        <tbody>
                          <tr
                            style="
                              padding: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class="m_4623704808790991326phenom-details"
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                line-height: 30px;
                                font-size: 14px;
                                font-family: -apple-system,
                                  BlinkMacSystemFont, Segoe UI, Roboto,
                                  Noto Sans, Ubuntu, Droid Sans,
                                  Helvetica Neue, sans-serif;
                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              Hey ${data?.user},
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;
                                font-family: -apple-system,
                                  BlinkMacSystemFont, Segoe UI, Roboto,
                                  Noto Sans, Ubuntu, Droid Sans,
                                  Helvetica Neue, sans-serif;
                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              This is a kind reminder that you
                              subscription
                              <strong>${data?.SubscriptionPlanName}</strong>
                              is going to end in
                              <strong>${data?.remainingDays} days</strong>.
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;
                                font-family: -apple-system,
                                  BlinkMacSystemFont, Segoe UI, Roboto,
                                  Noto Sans, Ubuntu, Droid Sans,
                                  Helvetica Neue, sans-serif;
                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              Please act soon to avoid interruption.
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;
                                font-family: -apple-system,
                                  BlinkMacSystemFont, Segoe UI, Roboto,
                                  Noto Sans, Ubuntu, Droid Sans,
                                  Helvetica Neue, sans-serif;
                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              Please
                              <a
                                target="_blank"
                                style="
                                  color: #000;
                                  text-decoration: none;
                                "
                                href="${process.env.FRONTEND_URL}"
                                >login</a
                              >
                              to browse some other subscriptions
                              through subscriptions page.
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;
                                font-family: -apple-system,
                                  BlinkMacSystemFont, Segoe UI, Roboto,
                                  Noto Sans, Ubuntu, Droid Sans,
                                  Helvetica Neue, sans-serif;
                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              Thanks,
                            </td>
                          </tr>
                          <tr
                            style="
                              padding-top: 0;
                              vertical-align: top;
                              text-align: left;
                            "
                            valign="top"
                            align="left"
                          >
                            <td
                              class=""
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                color: #172b4d;
                                font-weight: normal;
                                text-align: left;
                                font-size: 14px;
                                line-height: 30px;
                                border-collapse: collapse;
                              "
                              valign="top"
                              align="left"
                            >
                              ARI Team
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
                <tr
                  style="
                    padding: 0;
                    vertical-align: top;
                    text-align: left;
                  "
                  valign="top"
                  align="left"
                >
                  <td
                    style="
                      word-break: break-word;
                      vertical-align: top;
                      color: #172b4d;
                      font-weight: normal;
                      padding: 0;
                      margin: 0;
                      text-align: left;
                      font-size: 14px;
                      line-height: 19px;

                      border-collapse: collapse;
                    "
                    valign="top"
                    align="left"
                  >
                    <div
                      class="m_4623704808790991326trello-block-single-column m_4623704808790991326center"
                      style="
                        display: block;
                        margin: 0 auto;
                        max-width: 150px;
                        border-radius: 5em;
                        padding: 12px 16px;
                        background-color: #8967fc;
                      "
                    >
                      <p
                        style="
                          color: #fff;
                          font-weight: bold;
                          padding: 0;
                          margin: 0;
                          font-size: 14px;
                          line-height: 19px;

                          text-align: center;
                        "
                      >
                        <a
                          href="${process.env.FRONTEND_URL}"
                          style="color: #fff; text-decoration: none"
                          target="_blank"
                        >
                          Login</a
                        >
                      </p>
                    </div>
                  </td>
                </tr>
                <tr
                  style="
                    padding: 0;
                    vertical-align: top;
                    text-align: left;
                  "
                  valign="top"
                  align="left"
                >
                  <td
                    style="
                      word-break: break-word;
                      vertical-align: top;
                      color: #172b4d;
                      font-weight: normal;
                      padding: 0;
                      margin: 0;
                      text-align: left;
                      font-size: 14px;
                      line-height: 19px;

                      border-collapse: collapse;
                    "
                    valign="top"
                    align="left"
                  >
                    <div
                      class="m_4623704808790991326trello-block-single-column m_4623704808790991326center"
                      style="
                        display: block;
                        margin: 0 auto;
                        max-width: 580px;
                        padding: 12px 16px;
                      "
                    >
                      <p
                        style="
                          font-weight: normal;
                          padding: 0;
                          margin: 0;
                          font-size: 14px;
                          line-height: 19px;
                          margin-bottom: 10px;

                          text-align: center;
                          color: #9b9b9b;
                        "
                      >
                        Augmented Reality Innovation
                      </p>

                      <p
                        style="
                          font-weight: normal;
                          padding: 0;
                          margin: 0;
                          font-size: 14px;
                          line-height: 19px;
                          margin-bottom: 10px;

                          color: #9b9b9b;
                          text-align: center;
                        "
                      >
                        <a
                          href="https://dev.arinnovations.io "
                          style="
                            font-family: -apple-system,
                              BlinkMacSystemFont, Segoe UI, Roboto,
                              Noto Sans, Ubuntu, Droid Sans,
                              Helvetica Neue, sans-serif;
                            color: #9b9b9b;
                            text-decoration: underline;
                          "
                          target="_blank"
                          >www.arinnovations.io</a
                        >
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </td>
      </tr>
    </tbody>
  </table>
</body>
`;
};
