/**
 * DKDJS legal pages — /privacy, /terms, /refund-policy
 *
 * DRAFTED, NOT LAWYERED. These describe what the site and the business
 * actually do, and the commercial terms are the ones Daniel decided on
 * 2026-09-17 (retainer $200 non-refundable, balance 14 days out, photos with
 * opt-out). They have not been reviewed by an attorney. Have someone qualified
 * read them before relying on them in a dispute.
 *
 * Anything still unknown is marked [LIKE THIS] and must be filled in before
 * these go live. A legal page with a placeholder in it is worse than none.
 */

import { SITE, CITIES } from 'public/content';
import { POLICY, formatMoney } from 'public/pricing';

const ENTITY = SITE.legalName || 'New Ad City LLC';
const HOLD = formatMoney(POLICY.holdAmount);
const TERM = POLICY.holdTerm || 'retainer';
const BALANCE = POLICY.balanceDueDays;

/** Fill these in before publishing. */
export const LEGAL_CONFIG = {
  effectiveDate: 'September 17, 2026',
  address: '715 N Synergy Way, Eagle, ID 83616',
  /** Confirm with your accountant before publishing. */
  bookingRetentionYears: 7,
  leadRetentionMonths: 24,
  responseDays: 30,
  /** Deliberately conservative — easy to beat, hard to breach. */
  refundBusinessDays: 10
};

const C = LEGAL_CONFIG;

export const LEGAL = {

  /* ================================================================ PRIVACY */
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    updated: C.effectiveDate,
    intro: `${ENTITY}, trading as DKDJS ("we", "us"), runs dkdjs.com. This policy `
         + 'explains what we collect, why, and what you can do about it. It is written '
         + 'to describe what this site actually does rather than to cover every '
         + 'eventuality.',
    sections: [
      { h: 'Who we are', body: [
        `${ENTITY} DBA DKDJS, a DJ and event entertainment service operating in Boise and the Treasure Valley, Idaho.`,
        `Email: ${SITE.email}`,
        `Phone: ${SITE.phone}`,
        `Mailing address: ${C.address}`
      ]},
      { h: 'What you give us', body: [
        'When you check a date or send an enquiry, we collect what you type into the form: your name, email address and phone number; your event date, type, and start and end times; the venue name and city; an estimated guest count; the package and any add-ons you were looking at; and any notes you add.',
        'Only your email address and event date are required. Everything else helps us quote accurately and can be left blank.'
      ]},
      { h: 'What is collected automatically', body: [
        'This site is hosted on Wix. Wix collects standard technical information from visitors — IP address, browser and device type, pages visited, referring site and timestamps — and sets cookies to keep the site working and measure traffic. Wix describes its own practices at wix.com/about/privacy.',
        'Our pages load two typefaces from Google Fonts, and our contact page embeds a Google map. Both tell Google your IP address and basic browser information. We receive nothing from either.'
      ]},
      { h: 'Payments', body: [
        'We never see or store your card details. Payments are processed by our payment provider, and your receipt or card statement may reference ' + ENTITY + ' rather than DKDJS. The provider handles card data under its own privacy and security standards.'
      ]},
      { h: 'How we use it', body: [
        'To tell you whether your date is available; to hold a date and prepare a quote; to plan and run your event and contact you about it; to answer your questions; to keep the business records we are required to keep; and to understand how the site is used so we can improve it.',
        'We do not sell your personal information. We do not share it with advertisers, and we do not use it to build profiles for marketing to anyone other than you.',
        'We will only send you marketing email if you ask us to, and every such email will have an unsubscribe link.'
      ]},
      { h: 'Who else sees it', body: [
        'Wix — site hosting and our booking database.',
        'Our payment provider — your name, contact details and the amount, in order to take payment.',
        'We may disclose information where the law requires it, or to protect our rights or someone’s safety.',
        'If the business is ever sold or merged, customer records may transfer as part of it. We would tell you before that happened.'
      ]},
      { h: 'Photos and video at events', body: [
        'We photograph and record some of the events we work, and may use that material in our portfolio, on this website and on social media.',
        'You can opt out. Tell us in writing before your event — email is fine — and we will not photograph or record it for our own use. There is no cost and it does not affect anything else about your booking.',
        'If a guest at an event asks us not to photograph them, we will respect that on the day.'
      ]},
      { h: 'How long we keep it', body: [
        `Enquiries that do not become bookings: about ${C.leadRetentionMonths} months, then deleted.`,
        'Date holds that expire: marked expired automatically; the underlying enquiry follows the rule above.',
        `Completed bookings: about ${C.bookingRetentionYears} years, because tax and accounting records generally need to be kept.`,
        'Account holders: until you ask us to close the account.'
      ]},
      { h: 'Your choices', body: [
        'You can ask us to tell you what we hold about you, correct anything wrong, delete it where we are not required to keep it, stop sending you marketing, or give you a copy of what you gave us.',
        `Email ${SITE.email} and we will respond within ${C.responseDays} days. We may need to verify who you are first.`,
        'Depending on where you live you may have additional rights under your state’s law. Contact us and we will tell you how we handle your request.'
      ]},
      { h: 'Children', body: [
        'Our services are sold to adults and this site is not directed at children. We do not knowingly collect personal information from anyone under 13. If you believe a child has given us information, email us and we will delete it.'
      ]},
      { h: 'Security', body: [
        'We use Wix’s hosting and security infrastructure. Our booking records are stored in collections that are not publicly readable — the website asks our server whether a date is free, and a visitor only ever learns "open" or "taken", never whose event is on a given day.',
        'No system is perfectly secure and we cannot guarantee absolute security.'
      ]},
      { h: 'Changes', body: [
        'If we change this policy we will update the date at the top. Material changes will be announced on this page.'
      ]}
    ]
  },

  /* ================================================================== TERMS */
  terms: {
    slug: 'terms',
    title: 'Terms & Conditions',
    updated: C.effectiveDate,
    intro: `These terms apply to bookings with ${ENTITY}, trading as DKDJS. `
         + 'Booking an event with us means agreeing to them. If anything here does '
         + 'not suit your event, tell us before you book — most of it is negotiable '
         + 'if we agree it in writing first.',
    sections: [
      { h: 'Booking and confirmation', body: [
        `A date is only held once we have received the ${HOLD} ${TERM} and confirmed the booking in writing. Until then the date remains available to others, however far the conversation has gone.`,
        'We accept one event per calendar day. This is not a scheduling preference — both of us attend every event, which is what the service is.'
      ]},
      { h: 'Payment', body: [
        `The ${TERM} is ${HOLD} and comes off your total. It is not an additional fee.`,
        `The balance is due ${BALANCE} days before your event.`,
        'Payments are processed by our payment provider. Your receipt or statement may reference ' + ENTITY + ' rather than DKDJS.',
        'If the balance is not paid by the due date we will contact you. We reserve the right to treat a booking as cancelled if the balance remains unpaid at the time of the event.'
      ]},
      { h: 'What we provide', body: [
        'The package you booked, as described on this website at the time of booking, including both DJs, the equipment for the package, setup and teardown, a planning consultation and a music questionnaire.',
        'Spare microphones, cables and critical audio equipment travel to every event.',
        'We will use the equipment appropriate to your venue and guest count. Where a specific configuration matters to you, agree it with us in writing before the event.'
      ]},
      { h: 'What we need from you', body: [
        'Access to the venue with enough time to set up and sound-check before guests arrive.',
        'Access to adequate mains power at the performance location.',
        'A safe, dry, level area to set up, and shelter if the event is outdoors.',
        'Accurate timings, and reasonable notice of changes. We will do our best to accommodate late changes but cannot guarantee them.'
      ]},
      { h: 'Timings and overtime', body: [
        'Your package covers a set number of hours, starting at the agreed time. If the event starts late for reasons outside our control, the finish time does not automatically move.',
        'Additional hours can usually be added on the night if the venue permits, charged at our published extra-hour rate and payable afterwards.'
      ]},
      { h: 'Travel', body: [
        `We serve ${CITIES.join(', ')} and the surrounding Treasure Valley.`,
        'Travel to venues within that area is included in your package price.',
        'For venues outside it we are usually still happy to come, and will quote any travel cost before you book. You will never be charged for travel you did not agree to in advance.'
      ]},
      { h: 'Music and requests', body: [
        'You can give us a must-play list and a do-not-play list, and we will hold to both.',
        'We take guest requests at our discretion, filtered through your lists. If you would rather we took no requests at all, tell us.',
        'We cannot guarantee that any specific recording is available to us.'
      ]},
      { h: 'Photos and video', body: [
        'We may photograph or record your event for our portfolio, website and social media. You can opt out in writing before the event at no cost. See our Privacy Policy.'
      ]},
      { h: 'Conduct and safety', body: [
        'We may stop performing, without refund, if we reasonably believe there is a threat to the safety of guests, our team or our equipment, or if we are asked to do something unlawful.',
        'You are responsible for damage to our equipment caused by you or your guests.'
      ]},
      { h: 'Things outside anyone’s control', body: [
        'If we cannot perform because of something genuinely beyond our control — severe weather, serious illness, accident, venue closure, power failure — we will tell you as soon as we can and will make reasonable efforts to arrange a replacement DJ of comparable standard.',
        'If no replacement can be arranged, our liability is limited to refunding what you have paid us. See the Refund Policy.'
      ]},
      { h: 'Limitation of liability', body: [
        'Our total liability in connection with a booking is limited to the amount you have paid us for that booking.',
        'We are not liable for indirect or consequential losses.'
      ]},
      { h: 'Governing law', body: [
        'These terms are governed by the laws of the State of Idaho.'
      ]},
      { h: 'Changes to these terms', body: [
        'The terms that apply to your booking are the ones published when you booked. We may update these terms for future bookings at any time.'
      ]}
    ]
  },

  /* ================================================= CANCELLATION & REFUNDS */
  refund: {
    slug: 'refund-policy',
    title: 'Cancellation & Refund Policy',
    updated: C.effectiveDate,
    intro: 'We would rather be straight with you about this before you book than '
         + 'have it come as a surprise later. Here is exactly what happens if a '
         + 'booking is cancelled.',
    sections: [
      { h: `The ${TERM} is non-refundable`, body: [
        `The ${HOLD} ${TERM} reserves your date and is non-refundable.`,
        'The reason is simple: once we hold your date we turn down every other enquiry for it. We only take one event a day. By the time a cancellation comes through, the work we could have taken instead is usually gone.',
        `The ${TERM} comes off your total. It is not an extra charge.`
      ]},
      { h: 'If you cancel', body: [
        `More than ${BALANCE} days before the event: you lose the ${TERM}. Nothing further is owed, and anything you have paid beyond the ${TERM} is refunded.`,
        `Within ${BALANCE} days of the event: the balance is due and payable, because at that point the date cannot realistically be refilled.`,
        'Cancellations must be sent in writing to ' + SITE.email + '. The date we receive it is the date that counts.'
      ]},
      { h: 'If you move the date', body: [
        `If we are free on your new date and you tell us more than ${BALANCE} days before the original one, we will move your booking and your ${TERM} with it, at no charge.`,
        'If we are already booked on your new date, the cancellation terms above apply.',
        'A date can be moved once without charge. Beyond that, talk to us.'
      ]},
      { h: 'If we cancel', body: [
        'If we cannot perform for any reason, we will tell you immediately and make reasonable efforts to arrange a replacement DJ of comparable standard at no extra cost to you.',
        `If no suitable replacement can be arranged, you receive a full refund of everything you have paid us, including the ${TERM}.`,
        'This is the one circumstance in which the ' + TERM + ' is refunded.'
      ]},
      { h: 'If something goes wrong on the night', body: [
        'If equipment fails, we carry spares and will keep your event running. Backup gear travels to every event for exactly this reason.',
        'If you believe we did not deliver what you booked, tell us within 7 days of the event and we will discuss it properly. We would rather sort out a genuine problem than argue about it.'
      ]},
      { h: 'How refunds are paid', body: [
        `Refunds go back to the original payment method, and are processed within ${C.refundBusinessDays} business days of being agreed.`,
        'Payments are handled by ' + ENTITY + ', so a refund may appear under that name rather than DKDJS.'
      ]}
    ]
  }
};
