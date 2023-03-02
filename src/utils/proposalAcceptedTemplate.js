export const proposalAcceptedTemplate = (data) => {
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
                              Hello ${data.project.manager?.fullName}
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
                              ${data.user.fullName} has accepted the
                              proposal you sent for the project $
                              {data.project.name}.
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
                              To view more details about the project,
                              please click on the link below.
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
                                href="${process.env.FRONTEND_URL}/dashboard/projects/${data.project._id}"
                              >
                                ${process.env.FRONTEND_URL}
                                /dashboard/projects/$
                                {data.project._id}
                              </a>
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

export default proposalAcceptedTemplate;
