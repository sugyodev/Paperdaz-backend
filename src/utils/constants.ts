export const DEFAULT_VALUES = {
    users:{
      roles:{
        FREE_USER:"free_user",
        PAID_USER:"paid_user",
        TEAM_MEMBER:"team_member",
        ADMIN:"admin",
        SUPER_ADMIN:"super_admin",
      },
      status:{
        ACTIVE:"active",
        SUSPENDED:"suspended",
        EXPIRED:"expired",
        PENDING:"pending",
        DISABLED:"disabled",
      },
      FORGOT_PASSWORD:"forgot_password",
      RESET_PASSWORD:"reset_password",
    },
    errorMessage:{
      UNAUTHORIZED_FREE_USER: "Free users not authorized to access this",
      AUTHORIZED_PAID_USER: "you have to be a Paid user to access this",
      ADMIN_AUTHORIZED: "only admin is authorized to access this",
      UNAUTHORIZED: "you are not authorized to access this",
    },
    packagesTypes: {
      DEFAULT:"default",
      CUSTOM: "custom",
      PROMOTION:"promotion"
    },
    packagesPrices:{
      paperlink: 1,
      teamMembers: 1,
      cc: 1,
      publicProfile: 10,
      companyLedger: 10
    },
    subscriptionsPaymentType: {
        CARD: "card",
        CREDIT: "credit",
    },
    subscriptionsStatus: {
        ACTIVE: "active",
        EXPIRED: "expired",
    },
    subscriptionsPlan: {
        MONTHLY: "monthly",
        YEARLY: "yearly",
    },
    fileActions: {
      COMPLETE: "complete",
      SAVED:"save",
      CONFIRM: "confirm",
      SIGNED: "sign",
      SHARED: "share",
      UPLOADED: "upload",
      EDITING:"editing"
    },
    leavesEarned: {
      COMPLETE: 5,
      SAVED:20,
      CONFIRM: 5,
      SIGNED: 20,
      SHARED:10
    },
    sharedChannels: {
      FACEBOOK: "facebook",
      LINKED: "linked",
      TELEGRAM:"telegram",
      TWITTER: "twitter",
      WHATSAPP: "whatsapp",
      REDDIT: "reddit"
    },
    filesPrivacy: {
      PUBLIC: "public",
      PRIVATE: "private",
      DO_NOT_POST:"doNotPost"
    },
    supportStatus: {
      NEW: "new",
      INPROGRESS: "in progress",
      COMPLETED: "completed"
    },
    supportType: {
      CUSTOMER: "customer",
      PARTNERSHIP: "partnership"
    },
    fileUploadType: {
      FILE: "file",
      PROFILE_PICTURE: "profilePicture",
      SIGNATURE: "signature",
      INITIAL: "initial",
      PDF: "pdf"
    },
    adminSettings: {
      MAX_LEAVES: "max_leaves",
      REFERRAL_CREDIT: "referral_credit",
      REGISTRATION_LEAVES: "registration_leaves",
      TOTAL_LEAVES_DISPERSED: "total_leaves_dispersed",
      TOTAL_CREDIT_DISPERSED: "total_credit_dispersed",
      LEAVES_PER_FILE: 'leaves_per_file',
      LEAVES_PER_SHARE:"leaves_per_share"
    },
    referalType: {
      REGISTERATION: "registration",
      PAYMENT: "payment",
    },
    svgOption:{
      FILL:'fill',
      OPACITY:'opacity',
      DOT:'dot'
    },
    membersAccess:{
      OWN_FILES:'own_files',
      COMPANY_FILES:'company_files'
    },
    membersStatus:{
      ACTIVE:'active',
      DISABLE:'disable',
      PENDING:'pending'
    },
    teamAction:{
      JOIN_A_TEAM:'join_a_team',
      SWITCH_ACCOUNT: 'switch_account'
    },
    notificationType:{
      APP:'app',
      EMAIL: 'email'
    },
    socialLogin: {
      FACEBOOK:"facebook",
      TWITTER:"twitter",
      GOOGLE:"google"
    },
    notificationMessage: {
      REQUEST_TO_SIGN_A_FILE: 'has sent you an invitation request to sign a file',
      REQUEST_TO_JOIN_A_TEAM: 'has sent you an invitation to join a team of company',
      SUCCESSFULLY_JOIN_A_TEAM: 'has successfully signed the requested file',
      SUCCESSFULLY_SIGN_A_FILE: 'has successfully joined the team',
      SUCCESSFULLY_REFERRAL_SIGNUP: 'has successfully signup with your link',
      SUCCESSFULLY_REFERRAL_SUBSCRIPTION: 'you invited, has successfully subscribe to a package',
    },
    emailAction: {
      INVITE_LINK:"invite_link",
      REFERRAL_LINK:"referral_link",
      SHARE_FILE:"share_file",
      SAVE:"save",
      CONFIRM:"confirm",
      SIGN:"sign",

    },
    emailSubjects: {
      INVITE_LINK:"invite_link",
      REFERRAL_LINK:"referral_link",
      SHARE_FILE:"share_file",
      SAVE:"You Saved a file",
      CONFIRM:"File Confirmation",
      SIGN:"File Signed",
    },
    

}
