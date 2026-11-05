(() => {
  'use strict';
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  const feedback = document.getElementById('inquiry-feedback');
  const counter = document.getElementById('overview-count');
  const overview = document.getElementById('overview');
  const copyButton = document.getElementById('copy-inquiry');
  const issueBase = 'https://github.com/Willn0tBill/WilliamLi/issues/new';

  overview.addEventListener('input', () => {
    counter.textContent = String(overview.value.length);
  });

  const getField = (name) => form.elements.namedItem(name)?.value?.trim() || '';

  function validBrief(includePublicConsent) {
    const requiredIds = ['kind', 'subject', 'overview', 'reference'];
    for (const id of requiredIds) {
      const field = document.getElementById(id);
      if (!field.checkValidity()) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }
    const ref = getField('reference');
    if (ref) {
      try {
        const url = new URL(ref);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Not a web URL');
      } catch (error) {
        feedback.textContent = 'Please enter a full public website URL beginning with https://.';
        document.getElementById('reference').focus();
        return false;
      }
    }
    if (includePublicConsent) {
      const confirmed = document.getElementById('public-confirm');
      if (!confirmed.checked) {
        confirmed.reportValidity();
        confirmed.focus();
        return false;
      }
    }
    return true;
  }

  function briefText() {
    const kind = getField('kind');
    const subject = getField('subject');
    const timeline = getField('timeline');
    const description = getField('overview');
    const reference = getField('reference');
    return [
      '## Project inquiry',
      '',
      '**Type:** ' + kind,
      '**Subject:** ' + subject,
      '**Timeframe:** ' + timeline,
      '',
      '## Brief',
      description,
      '',
      ...(reference ? ['**Public reference:** ' + reference, ''] : []),
      '---',
      'This is a public project inquiry. Do not post private contact details, passwords, or confidential information.'
    ].join('\n');
  }

  function issueUrl() {
    const title = '[Inquiry] ' + getField('subject');
    return issueBase + '?title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(briefText());
  }

  function showIssueLink(message, url) {
    feedback.replaceChildren();
    feedback.append(document.createTextNode(message + ' '));
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Open your draft on GitHub ↗';
    feedback.append(link);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validBrief(true)) return;
    const url = issueUrl();
    // The issue is only a draft until the visitor reviews and submits on GitHub.
    window.open(url, '_blank', 'noopener,noreferrer');
    showIssueLink('Your GitHub issue draft is ready. Review it, then click Submit new issue on GitHub. Nothing has been sent by this website.', url);
  });

  copyButton.addEventListener('click', async () => {
    if (!validBrief(false)) return;
    const message = briefText();
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(message);
      feedback.textContent = 'Inquiry copied. No information was submitted or stored by this website.';
    } catch (error) {
      const helper = document.createElement('textarea');
      helper.value = message;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.left = '-9999px';
      document.body.appendChild(helper);
      helper.select();
      const success = document.execCommand('copy');
      helper.remove();
      feedback.textContent = success
        ? 'Inquiry copied. No information was submitted or stored by this website.'
        : 'Clipboard access was blocked. Use the GitHub draft button to review your inquiry.';
    }
  });
})();
