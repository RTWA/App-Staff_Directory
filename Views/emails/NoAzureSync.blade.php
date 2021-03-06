<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

  <head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <!--[if mso]>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
    <style>
      td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
    </style>
  <![endif]-->
    <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&amp;amp;display=swap" rel="stylesheet" media="screen">
    <style>
      @media (prefers-color-scheme: dark) {

        body,
        .email-body,
        .email-content,
        .email-wrapper,
        .email-masthead,
        .email-footer {
          background-color: #333333 !important;
          color: #ffffff !important;
        }

        .email-body_inner {
          background-color: #222222 !important;
          color: #ffffff !important;
        }

        p,
        ul,
        ol,
        blockquote,
        h1,
        h2,
        h3 {
          color: #ffffff !important;
        }
      }

      @media (max-width: 600px) {
        .sm-w-full {
          width: 100% !important;
        }
      }
    </style>
  </head>

  <body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; background-color: #f2f4f6;">
    <div role="article" aria-roledescription="email" aria-label="" lang="en">
      <table class="email-wrapper" style="background-color: #f2f4f6; font-family: 'Nunito Sans', -apple-system, 'Segoe UI', sans-serif; width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="email-content" style="width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" class="email-masthead" style="font-size: 16px; padding-top: 25px; padding-bottom: 25px; text-align: center;"></td>
              </tr>
              <tr>
                <td class="email-body" style="width: 100%;">
                  <table align="center" class="email-body_inner sm-w-full" style="background-color: #ffffff; margin-left: auto; margin-right: auto; width: 570px;" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="padding: 45px;">
                        <div style="font-size: 16px;">
                          <h1 style="font-weight: 700; font-size: 24px; margin-top: 0; text-align: left; color: #333333;">Staff Directory - Azure Sync Issue!</h1>
                          <p style="font-size: 16px; line-height: 24px; margin-top: 6px; margin-bottom: 20px; color: #51545e;">
                            This email is to warn you that your Staff Directory App in WebApps has not successfully synced with Azure since {{ $last_sync }}
                          </p>
                          <p style="font-size: 16px; line-height: 24px; margin-top: 6px; margin-bottom: 20px; color: #51545e;">
                            Use the link below to go your Staff Directory App settings and perform a manual sync.
                          </p>
                          <table align="center" style="margin-top: 30px; margin-bottom: 30px; margin-left: auto; margin-right: auto; text-align: center; width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td align="center">
                                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                    <td align="center" style="font-size: 16px;">
                                      <a href="{{ $Settings_URL }}" class="button" target="_blank" style="display: inline-block; color: #ffffff; text-decoration: none; border-radius: 3px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16); background-color: #22bc66; border-color: #22bc66; border-style: solid; border-width: 10px 18px;">Staff Directory Settings</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <p style="font-size: 16px; line-height: 24px; margin-top: 6px; margin-bottom: 20px; color: #51545e;">
                            If syncs continue to fail, then there may be issue with your App Registration in Azure, or an issue with your Staff Directory App settings.
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table align="center" class="email-footer sm-w-full" style="margin-left: auto; margin-right: auto; text-align: center; width: 570px;" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td align="center" style="font-size: 16px; padding: 45px;">
                        <p style="font-size: 13px; line-height: 24px; margin-top: 6px; margin-bottom: 20px; text-align: center; color: #a8aaaf;">WebApps</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>

</html>