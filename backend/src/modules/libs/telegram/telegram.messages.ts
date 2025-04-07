import type { User } from '@/prisma/generated' //SponsorshipPlan
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'

export const MESSAGES = {
    welcome:
        `<b>👋 Welcome to WG-Stream Bot!</b>\n\n` +
        `To receive notifications and enhance your platform experience, let's link your Telegram account to WG-Stream.\n\n` +
        `Click the button below and go to the <b>Notifications</b> section to complete the setup.`,
    authSuccess: `🎉 You have successfully logged in and your Telegram account is now linked to WG-Stream!\n\n`,
    invalidToken: '❌ Invalid or expired token.',
    profile: (user: User, followersCount: number) =>
        `<b>👤 User Profile:</b>\n\n` +
        `👤 Username: <b>${user.username}</b>\n` +
        `📧 Email: <b>${user.email}</b>\n` +
        `👥 Followers: <b>${followersCount}</b>\n` +
        `📝 About: <b>${user.bio || 'Not specified'}</b>\n\n` +
        `🔧 Click the button below to go to profile settings.`,
    follows: (user: User) =>
        `📺 <a href="https://wg-stream.com/${user.username}">${user.username}</a>`,
    resetPassword: (token: string, metadata: SessionMetadata) =>
        `<b>🔒 Password Reset</b>\n\n` +
        `You requested a password reset for your account on <b>WG-Stream</b>.\n\n` +
        `To create a new password, please follow this link:\n\n` +
        `<b><a href="https://wg-stream.com/account/recovery/${token}">Reset Password</a></b>\n\n` +
        `📅 <b>Request Date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
        `🖥️ <b>Request Info:</b>\n\n` +
        `🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
        `📱 <b>OS:</b> ${metadata.device.os}\n` +
        `🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
        `💻 <b>IP Address:</b> ${metadata.ip}\n\n` +
        `If you did not make this request, simply ignore this message.\n\n` +
        `Thank you for using <b>WG-Stream</b>! 🚀`,
    deactivate: (token: string, metadata: SessionMetadata) =>
        `<b>⚠️ Account Deactivation Request</b>\n\n` +
        `You have initiated the process of deactivating your account on <b>WG-Stream</b>.\n\n` +
        `To complete the operation, please confirm your request by entering the following confirmation code:\n\n` +
        `<b>Confirmation Code: ${token}</b>\n\n` +
        `📅 <b>Request Date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
        `🖥️ <b>Request Info:</b>\n\n` +
        `• 🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
        `• 📱 <b>OS:</b> ${metadata.device.os}\n` +
        `• 🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
        `• 💻 <b>IP Address:</b> ${metadata.ip}\n\n` +
        `<b>What happens after deactivation?</b>\n\n` +
        `1. You will be logged out and lose access to your account.\n` +
        `2. If you don't cancel deactivation within 7 days, your account will be <b>permanently deleted</b> along with all your information, data, and subscriptions.\n\n` +
        `<b>⏳ Note:</b> If you change your mind within 7 days, you can contact our support to recover your account before it's permanently deleted.\n\n` +
        `After deletion, the account cannot be restored and all data will be lost permanently.\n\n` +
        `If you changed your mind, simply ignore this message. Your account will remain active.\n\n` +
        `Thank you for using <b>WG-Stream</b>! We’re always happy to have you on the platform and hope you’ll stay with us. 🚀\n\n` +
        `Sincerely,\n` +
        `The WG-Stream Team`,
    accountDeleted:
        `<b>⚠️ Your account has been permanently deleted.</b>\n\n` +
        `Your account has been removed from WG-Stream's database. All your data and information have been permanently erased. ❌\n\n` +
        `🔒 You will no longer receive notifications in Telegram or by email.\n\n` +
        `If you wish to return to the platform, you can register at the following link:\n` +
        `<b><a href="https://wg-stream.com/account/create">Register on WG-Stream</a></b>\n\n` +
        `Thank you for being with us! We’re always happy to welcome you back. 🚀\n\n` +
        `Sincerely,\n` +
        `The WG-Stream Team`,
    streamStart: (channel: User) =>
        `<b>📡 ${channel.displayName} has started streaming!</b>\n\n` +
        `Watch now: <a href="https://wg-stream.com/${channel.username}">Go to stream</a>`,
    newFollowing: (follower: User, followersCount: number) =>
        `<b>You have a new follower!</b>\n\nIt's <a href="https://wg-stream.com/${follower.username}">${follower.displayName}</a>\n\nYour total channel followers: ${followersCount}`,
    newSponsorship: (plan: any, sponsor: User) =>
        `<b>🎉 New Sponsorship!</b>\n\n` +
        `You've received a new sponsorship for the <b>${plan.title}</b> plan.\n` +
        `💰 Amount: <b>${plan.price} ₴</b>\n` +
        `👤 Sponsor: <a href="https://wg-stream.com/${sponsor.username}">${sponsor.displayName}</a>\n` +
        `📅 Date: <b>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</b>`,
    enableTwoFactor:
        `🔐 Secure your account!\n\n` +
        `Enable two-factor authentication in your <a href="https://wg-stream.com/dashboard/settings">account settings</a>.`,
    verifyChannel:
        `<b>🎉 Congratulations! Your channel is now verified</b>\n\n` +
        `We're happy to inform you that your channel has been verified and you now have an official badge.\n\n` +
        `Verification confirms your channel’s authenticity and increases viewer trust.\n\n` +
        `Thank you for being with us and growing your channel with WG-Stream!`
}