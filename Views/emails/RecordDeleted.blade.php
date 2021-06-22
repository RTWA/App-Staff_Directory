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
        .email-body_inner,
        .email-content,
        .email-wrapper,
        .email-masthead,
        .email-footer {
          background-color: #333333 !important;
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
                          <h1 style="font-weight: 700; font-size: 24px; margin-top: 0; text-align: left; color: #333333;">Hi there,</h1>
                          <p style="font-size: 16px; line-height: 24px; margin-top: 6px; margin-bottom: 20px; color: #51545e;">
                            A record was deleted from the Staff Directory App in WebApps.
                          </p>
                          <div style="border-radius: 8px; display: inline-flex; flex-direction: row; height: 126px; overflow: hidden; width: 320px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);">
                            <div style="width: 126px;">
                              <img src="{{ $message->embed($url.'/apps/StaffDirectory/view/person/'.$person->id.'/photo') }}" alt="{{ $person->forename }} {{ $person->surname }} - Photo" style="border: 0; line-height: 100%; max-width: 100%; vertical-align: middle; height: 126px; width: 100%;">
                            </div>
                            <div style="background-color: #{{ $theme }}; border-color: #1f2937; border-style: solid; border-width: 0px; border-left-width: 4px; height: 126px; padding-left: 2px; padding-right: 2px; padding-top: 6px; padding-bottom: 6px; position: relative; text-align: center; color: #ffffff; width: 100%;">
                              <h3 style="margin: 0px; font-weight: 600;">{{ $person->forename }} {{ $person->surname }}</h3>
                              <p style="margin: 0px; font-style: italic;">{{ $person->title }}</p>
                              <p style="margin: 0px; margin-bottom: 1.5rem; font-weight: 600;">{{ $person->departmentString }}</p>
                              <p style="margin: 0px; font-size: 0.875rem; line-height: 1.25rem; display: flex; flex-direction: row; justify-content: center;">
                                @if (!is_null($person->email))
                                <span style="flex-grow: 1;">
                                  <a href="mailto:{{ $person->email }}" style="display: flex; flex-direction: row; align-items: center; justify-content: center; color: #ffffff; text-decoration: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" style="margin-right:0.25rem;height:20px;width:20px;" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillrule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" cliprule="evenodd"></path>
                                    </svg>
                                    E-Mail
                                  </a>
                                </span>
                                @endif
                                @if (!is_null($person->phone))
                                <span style="flex-grow: 1;">
                                  <a href="tel:{{ $person->phone }}" style="display: flex; flex-direction: row; align-items: center; justify-content: center; color: #ffffff; text-decoration: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" style="margin-right:0.25rem;height:20px;width:20px;" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                    </svg>
                                    {{ $person->phone }}
                                  </a>
                                </span>
                                @endif
                            </div>
                          </div>
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