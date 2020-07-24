#!/usr/bin/env node

const fs = require('fs')
const { program } = require('commander')
program.version('1.0.0', '-v, --version', 'Output the current version')

const files = fs.readdirSync('tmp_archive')
files.forEach((filename) => {
  if (filename.includes('pull_requests_')) {
    const prs = JSON.parse(fs.readFileSync('./tmp_archive/' + filename))
    const newPRs = prs.map((pr) => {
      const filteredRequests = pr.review_requests.filter((request) => request.reviewer_type !== 'Team')
      pr.review_requests = filteredRequests

      return pr
    })

    fs.writeFileSync('./tmp_archive/' + filename, JSON.stringify(newPRs))
  } else if (filename.includes('protected_branches_')) {
    const protectedBranches = JSON.parse(fs.readFileSync('./tmp_archive/' + filename))
    const newBranches = protectedBranches.map((branch) => {
      branch.authorized_team_urls = []
      branch.dismissal_restricted_team_urls = []
      return branch
    })
    fs.writeFileSync('./tmp_archive/' + filename, JSON.stringify(newBranches))
  } else if (filename.includes('issue_events_')) {
    const issueEvents = JSON.parse(fs.readFileSync('./tmp_archive/' + filename))
    const filteredEvents = issueEvents.filter((event) => event.subject === undefined || !event.subject.includes('/teams/'))

    fs.writeFileSync('./tmp_archive/' + filename, JSON.stringify(filteredEvents))
  }
})
