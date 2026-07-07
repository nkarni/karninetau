<?php
/**
 * Copy this file to smtp-config.php on the server (same folder as contact.php).
 * Fill username, password, and email addresses. Do NOT commit smtp-config.php.
 *
 * If sending fails: create an empty file named .contact-mail-debug next to contact.php, try again,
 * and the real SMTP error will appear on the form; or read .smtp-last-error.txt in the same folder (FTP).
 * Remove .contact-mail-debug after fixing.
 *
 * Use ONE of these (both are valid):
 *   • Port 587 + encryption "tls"   (STARTTLS — often easiest through firewalls)
 *   • Port 465 + encryption "ssl"   (implicit SSL / SMTPS)
 *
 * "Could not authenticate" (SMTP connects but rejects login):
 *   • username must be the full mailbox email (exactly what works in Outlook/Apple Mail)
 *   • password is that mailbox password — copy carefully; reset via panel if unsure
 *   • from_email should be an address on that mailbox (often identical to username)
 */

return [
    'host' => 'mail.yourhost.com',
    /** Try 587 + tls first; if that fails from your server, switch to port 465 + ssl */
    'port' => 587,
    /** For port 587 use 'tls'; for port 465 use 'ssl' */
    'encryption' => 'tls',
    /** Full mailbox address — same one you use in Apple Mail / Outlook for this domain */
    'username' => 'nk@karni.net.au',
    'password' => 'your-mailbox-password',
    /** Should match an address on this account (often same as username) */
    'from_email' => 'nk@karni.net.au',
    'from_name' => 'Nitzan Karni website',
    /** Where enquiries are delivered */
    'to_email' => 'nk@karni.net.au',
    'subject_prefix' => '[Website contact]',
    /**
     * Set true only while testing from the browser; returns the SMTP error text in JSON.
     * Turn off afterward (avoid exposing internals to visitors).
     */
    'show_mail_errors' => false,
    /** If you get SSL/certificate handshake errors, try true (less strict TLS verification). */
    'smtp_insecure_tls' => false,
    /** Outbound SMTP seconds (try 45 if timeouts). */
    'timeout' => 30,
    /**
     * Optional hidden captcha: Cloudflare Turnstile **secret key** only (never in the frontend).
     * If set here, Turnstile is required on submit; leave empty for honeypots only.
     */
    'turnstile_secret' => '',
];
