import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  LayoutGrid, Users, BarChart3, BookOpen, ChevronDown, ChevronRight,
  Bot, Briefcase, Clock, AlertTriangle, Wallet, Sparkles, ShieldCheck, Megaphone, Radio
} from 'lucide-react';

/* ============================= MOCK DATA ============================= */
/* Everything below is illustrative sample data for demonstration only. */

const kpis = {
  openRoles: 14,
  applications: 348,
  aiShortlisted: 89,
  avgTimeToHire: 18,
  attritionRisk: 14,
};

const applicationsTrend = [
  { month: 'Mar', applications: 42 },
  { month: 'Apr', applications: 58 },
  { month: 'May', applications: 51 },
  { month: 'Jun', applications: 67 },
  { month: 'Jul', applications: 73 },
  { month: 'Aug', applications: 57 },
];

const activityFeed = [
  { text: 'AI shortlisted 6 candidates for Senior Data Analyst', time: '2h ago' },
  { text: 'AI flagged a possible ghost job \u2014 Plant Operations Supervisor open 74+ days with no offer made', time: '3h ago' },
  { text: 'AI flagged 3 employees in Operations as elevated attrition risk', time: '5h ago' },
  { text: 'AI completed screening on 42 new applications overnight', time: '11h ago' },
  { text: 'AI scheduled 5 first-round interviews for Product Manager', time: '1d ago' },
];

const jobPostings = [
  { id: 'jp1', title: 'Senior Data Analyst', dept: 'Analytics', applications: 52, shortlisted: 14, status: 'Active' },
  { id: 'jp2', title: 'Product Manager', dept: 'Product', applications: 38, shortlisted: 9, status: 'Active' },
  { id: 'jp3', title: 'HR Business Partner', dept: 'Human Resources', applications: 29, shortlisted: 7, status: 'Active' },
  { id: 'jp4', title: 'Territory Sales Executive', dept: 'Sales', applications: 61, shortlisted: 18, status: 'Active' },
  { id: 'jp5', title: 'Plant Operations Supervisor', dept: 'Operations', applications: 34, shortlisted: 8, status: 'Interviewing' },
  { id: 'jp6', title: 'Graphic Designer', dept: 'Marketing', applications: 47, shortlisted: 11, status: 'Closed' },
];

const candidates = [
  {
    id: 'c1', name: 'Ananya Rao', role: 'Senior Data Analyst', match: 94, stage: 'Interview',
    experience: '6 yrs', skills: ['SQL', 'Python', 'Power BI'],
    breakdown: { skills: 96, experience: 92, education: 90 },
    summary: 'Strong overlap across every core requirement, with 6 years in analytics roles using SQL and Python daily. Recommended for interview.',
  },
  {
    id: 'c2', name: 'Karan Mehta', role: 'Senior Data Analyst', match: 89, stage: 'Interview',
    experience: '5 yrs', skills: ['Python', 'Tableau', 'Statistics'],
    breakdown: { skills: 90, experience: 88, education: 88 },
    summary: 'Solid statistical background and strong Tableau portfolio. Slightly less SQL depth than top match, still well above the role threshold.',
  },
  {
    id: 'c3', name: 'Priya Nair', role: 'Senior Data Analyst', match: 82, stage: 'Screened',
    experience: '4 yrs', skills: ['Excel', 'SQL', 'R'],
    breakdown: { skills: 84, experience: 78, education: 85 },
    summary: 'Good fundamentals with R experience the team has been short on. Experience is a year below the posting\u2019s preferred range.',
  },
  {
    id: 'c4', name: 'Rahul Verma', role: 'Senior Data Analyst', match: 76, stage: 'Screened',
    experience: '3 yrs', skills: ['Python', 'SQL'],
    breakdown: { skills: 79, experience: 68, education: 80 },
    summary: 'Core tooling matches well, but experience is on the lighter side for a senior-titled opening.',
  },
  {
    id: 'c5', name: 'Sneha Iyer', role: 'Senior Data Analyst', match: 68, stage: 'New',
    experience: '2 yrs', skills: ['Excel', 'Power BI'],
    breakdown: { skills: 70, experience: 55, education: 80 },
    summary: 'Reporting-tool skills are relevant, but limited SQL/Python exposure so far. Worth a screening call to confirm depth.',
  },
  {
    id: 'c6', name: 'Arjun Kapoor', role: 'Senior Data Analyst', match: 61, stage: 'New',
    experience: '2 yrs', skills: ['SQL'],
    breakdown: { skills: 65, experience: 52, education: 68 },
    summary: 'Below the shortlist threshold on current data. Flagged for manual review rather than auto-reject.',
  },
];

const sampleChat = [
  { from: 'ai', text: 'Hi Ananya, thanks for applying to the Senior Data Analyst role. Could you walk me through a recent project where you used SQL and Python together?' },
  { from: 'candidate', text: 'Sure \u2014 I led a churn analysis project. I used SQL to pull and join data from four source systems, then built a Python pipeline for the predictive model.' },
  { from: 'ai', text: 'Got it. What came out of that project?' },
  { from: 'candidate', text: 'We identified a high-risk segment worth about 12% of customers, and the retention team used it to bring churn down a few points that quarter.' },
  { from: 'ai', text: 'Helpful context, thank you. Are you comfortable working in Power BI for reporting, or is that mainly Python and Tableau for you?' },
  { from: 'candidate', text: 'Mostly Python and Tableau, but I\u2019ve picked up Power BI basics in my current role.' },
  { from: 'ai', text: 'Noted, thanks Ananya. I\u2019ve shared your responses with the hiring team \u2014 someone will follow up on next steps within 3 business days.' },
];

const attritionByDept = [
  { dept: 'Engineering', risk: 11 },
  { dept: 'Sales', risk: 19 },
  { dept: 'Operations', risk: 22 },
  { dept: 'HR', risk: 8 },
  { dept: 'Marketing', risk: 14 },
  { dept: 'Analytics', risk: 9 },
];

const atRiskEmployees = [
  { role: 'Site Supervisor', dept: 'Operations', score: 82, factor: 'Tenure under 1 year, rising absenteeism' },
  { role: 'Sales Executive', dept: 'Sales', score: 76, factor: 'Below-average engagement score, no recent promotion' },
  { role: 'Machine Operator', dept: 'Operations', score: 71, factor: 'High absenteeism, heavy overtime load' },
  { role: 'Marketing Associate', dept: 'Marketing', score: 64, factor: 'Below-average engagement score' },
  { role: 'Data Analyst', dept: 'Analytics', score: 58, factor: 'Tenure under 1 year' },
];

const absenteeismTrend = [
  { month: 'Mar', rate: 3.8 },
  { month: 'Apr', rate: 4.1 },
  { month: 'May', rate: 4.6 },
  { month: 'Jun', rate: 4.3 },
  { month: 'Jul', rate: 4.9 },
  { month: 'Aug', rate: 4.5 },
];

const hiringFunnel = [
  { stage: 'Applied', count: 348 },
  { stage: 'AI-screened', count: 210 },
  { stage: 'Interviewed', count: 95 },
  { stage: 'Offered', count: 40 },
  { stage: 'Hired', count: 28 },
];

const workforceComposition = [
  { dept: 'Operations', count: 90 },
  { dept: 'Engineering', count: 62 },
  { dept: 'Sales', count: 48 },
  { dept: 'Other', count: 26 },
  { dept: 'Analytics', count: 22 },
  { dept: 'Marketing', count: 18 },
  { dept: 'HR', count: 14 },
];

const timeToHireTrend = [
  { month: 'Mar', days: 24 },
  { month: 'Apr', days: 22 },
  { month: 'May', days: 21 },
  { month: 'Jun', days: 19 },
  { month: 'Jul', days: 17 },
  { month: 'Aug', days: 18 },
];

const donutColors = ['#14213D', '#E8A33D', '#2A8C7F', '#E0654A', '#6B7280', '#8B7355', '#5B7FA6'];

const evpPillars = [
  { title: 'Growth & learning', body: 'A yearly upskilling budget per employee, plus internal-mobility postings before external ones.' },
  { title: 'Meaningful work', body: 'Roles are mapped to a visible business outcome, not just a task list.' },
  { title: 'Flexibility', body: 'Hybrid by default, core hours only, no location-based pay cuts.' },
  { title: 'Fair reward', body: 'Published pay bands and an annual pay-equity audit.' },
];

const deiFunnel = [
  { stage: 'Applied', women: 41 },
  { stage: 'AI-shortlisted', women: 38 },
  { stage: 'Interviewed', women: 36 },
  { stage: 'Hired', women: 34 },
];

const engagementByGeneration = [
  { group: 'Gen Z', score: 3.3 },
  { group: 'Millennial', score: 3.7 },
  { group: 'Gen X', score: 3.9 },
];

const onboardingKpis = {
  retention90Day: 91,
  timeToProductivityWeeks: 6,
};

const workplaceSignals = [
  { term: 'Ghost job', category: 'Recruitment', detail: 'Plant Operations Supervisor has been open 74 days with 34 applications and no offer made — worth confirming the role is still being actively filled.' },
  { term: 'Candidate ghosting', category: 'Recruitment', detail: '3 shortlisted candidates for Territory Sales Executive have not responded to outreach in 5+ days.' },
  { term: 'Recruitment breadcrumbing', category: 'Recruitment', detail: 'Two candidates for HR Business Partner have been told "still under review" for 3 consecutive weeks with no decision made.' },
  { term: 'Silver-medallist candidate', category: 'Recruitment', detail: 'Karan Mehta, 89% match and a Q1 runner-up for a similar analyst role, could be a fast re-approach for the open Senior Data Analyst position.' },
  { term: 'Quiet quitting', category: 'Workforce', detail: 'Engineering task-completion is on target, but after-hours activity has dropped 22% over six weeks — a signal worth a check-in, not a performance flag.' },
  { term: 'Proximity bias', category: 'Workforce', detail: 'Office-based employees received 30% more stretch assignments than remote employees with comparable review scores this quarter.' },
  { term: 'Resenteeism', category: 'Workforce', detail: 'Two employees in Operations are past their typical tenure-to-exit window while showing Medium engagement — a retention conversation may land better than a workload increase.' },
  { term: 'Job hugging', category: 'Workforce', detail: 'Promotion-eligible employees in Sales are applying to internal openings at half the typical rate this cycle, consistent with broader hiring-market caution.' },
];

const skillGaps = [
  { skill: 'Data & Analytics', required: 80, available: 62 },
  { skill: 'AI / ML', required: 70, available: 35 },
  { skill: 'Digital Marketing', required: 65, available: 58 },
  { skill: 'People Leadership', required: 75, available: 68 },
];

/* ============================= HELPERS ============================= */

function riskBand(score) {
  if (score >= 70) return { label: 'High', cls: 'text-coral', bar: 'bg-coral' };
  if (score >= 40) return { label: 'Medium', cls: 'text-amber', bar: 'bg-amber' };
  return { label: 'Low', cls: 'text-teal', bar: 'bg-teal' };
}

function matchTone(pct) {
  if (pct >= 85) return 'bg-teal';
  if (pct >= 70) return 'bg-amber';
  return 'bg-coral';
}

/* ============================= SMALL PIECES ============================= */

function StatBlock({ value, label, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <Icon size={18} className="text-muted mt-1 shrink-0" strokeWidth={1.75} />
      <div>
        <div className="font-display text-2xl md:text-3xl text-ink leading-none">{value}</div>
        <div className="text-sm text-muted mt-1">{label}</div>
      </div>
    </div>
  );
}

function StatusChip({ status }) {
  const map = {
    Active: 'text-teal border-teal',
    Interviewing: 'text-amber border-amber',
    Closed: 'text-muted border-line',
  };
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${map[status] || 'text-muted border-line'}`}>
      {status}
    </span>
  );
}

function Panel({ title, description, children, className = '' }) {
  return (
    <div className={`bg-paper-raised border border-line rounded-lg p-5 ${className}`}>
      {title && <h3 className="font-display text-lg text-ink mb-1">{title}</h3>}
      {description && <p className="text-sm text-muted mb-4">{description}</p>}
      {children}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-3 text-sm border-b-2 transition-colors ${
        active ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-body'
      }`}
    >
      <Icon size={16} strokeWidth={1.75} />
      {children}
    </button>
  );
}

function SegButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap shrink-0 ${
        active ? 'bg-ink text-white' : 'text-muted hover:text-body'
      }`}
    >
      {children}
    </button>
  );
}

/* ============================= TABS ============================= */

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink mb-1">Today's signal</h2>
        <p className="text-sm text-muted">A working snapshot of hiring and workforce health, updated as new data comes in.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-5 border-y border-line py-5">
        <StatBlock icon={Briefcase} value={kpis.openRoles} label="Open roles" />
        <StatBlock icon={Users} value={kpis.applications} label="Applications" />
        <StatBlock icon={Sparkles} value={kpis.aiShortlisted} label="AI-shortlisted" />
        <StatBlock icon={Clock} value={`${kpis.avgTimeToHire}d`} label="Avg. time-to-hire" />
        <StatBlock icon={AlertTriangle} value={`${kpis.attritionRisk}%`} label="Elevated attrition risk" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel title="Applications, last 6 months" className="lg:col-span-2">
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationsTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E1DA" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#62666F' }} axisLine={{ stroke: '#E4E1DA' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#62666F' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E4E1DA' }} />
                <Line type="monotone" dataKey="applications" stroke="#14213D" strokeWidth={2.5} dot={{ r: 3, fill: '#14213D' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Recent AI activity">
          <ul className="space-y-3">
            {activityFeed.map((a, i) => (
              <li key={i} className="text-sm">
                <p className="text-body leading-snug">{a.text}</p>
                <p className="text-xs text-muted mt-0.5">{a.time}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function RecruitmentTab() {
  const [sub, setSub] = useState('postings');
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-ink mb-1">AI recruitment</h2>
        <p className="text-sm text-muted">Screening, matching, and first-round conversation, handled by the AI layer before a recruiter steps in.</p>
      </div>

      <div className="flex gap-1 bg-paper border border-line rounded-md p-1 w-full overflow-x-auto">
        <SegButton active={sub === 'postings'} onClick={() => setSub('postings')}>Job postings</SegButton>
        <SegButton active={sub === 'pipeline'} onClick={() => setSub('pipeline')}>Candidate pipeline</SegButton>
        <SegButton active={sub === 'chat'} onClick={() => setSub('chat')}>Screening chat</SegButton>
        <SegButton active={sub === 'sourcing'} onClick={() => setSub('sourcing')}>Sourcing</SegButton>
        <SegButton active={sub === 'brand'} onClick={() => setSub('brand')}>Employer brand</SegButton>
      </div>

      {sub === 'postings' && (
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-line">
                  <th className="font-normal py-2 pr-3">Role</th>
                  <th className="font-normal py-2 pr-3">Department</th>
                  <th className="font-normal py-2 pr-3">Applications</th>
                  <th className="font-normal py-2 pr-3">AI-shortlisted</th>
                  <th className="font-normal py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobPostings.map((jp) => (
                  <tr key={jp.id} className="border-b border-line last:border-0">
                    <td className="py-3 pr-3 text-body">{jp.title}</td>
                    <td className="py-3 pr-3 text-muted">{jp.dept}</td>
                    <td className="py-3 pr-3 text-body">{jp.applications}</td>
                    <td className="py-3 pr-3 text-body">{jp.shortlisted}</td>
                    <td className="py-3"><StatusChip status={jp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {sub === 'pipeline' && (
        <Panel title="Senior Data Analyst" description="Top matches, ranked by the AI match score. Select a candidate to see the full breakdown.">
          <div className="space-y-2">
            {candidates.map((c) => {
              const isOpen = expanded === c.id;
              return (
                <div key={c.id} className="border border-line rounded-md overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : c.id)}
                    className="w-full flex items-center gap-4 p-3 text-left hover:bg-paper transition-colors"
                  >
                    {isOpen ? <ChevronDown size={16} className="text-muted shrink-0" /> : <ChevronRight size={16} className="text-muted shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-body text-sm">{c.name}</span>
                        <span className="font-display text-sm text-ink shrink-0">{c.match}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full bg-paper rounded-full overflow-hidden">
                        <div className={`h-full ${matchTone(c.match)}`} style={{ width: `${c.match}%` }} />
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted">
                        <span>{c.experience}</span>
                        <span>&middot;</span>
                        <span>{c.skills.join(', ')}</span>
                        <span className="ml-auto">{c.stage}</span>
                      </div>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-4 pt-1 border-t border-line bg-paper">
                      <div className="grid grid-cols-3 gap-4 mb-3 mt-3">
                        <div>
                          <div className="text-xs text-muted mb-1">Skills match</div>
                          <div className="font-display text-lg text-ink">{c.breakdown.skills}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted mb-1">Experience match</div>
                          <div className="font-display text-lg text-ink">{c.breakdown.experience}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted mb-1">Education match</div>
                          <div className="font-display text-lg text-ink">{c.breakdown.education}%</div>
                        </div>
                      </div>
                      <p className="text-sm text-body leading-relaxed">{c.summary}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {sub === 'chat' && (
        <Panel title="Sample AI screening conversation" description="First-round screening for the Senior Data Analyst role. The AI asks structured follow-ups and hands a summary to the recruiter.">
          <div className="space-y-3 max-w-2xl">
            {sampleChat.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.from === 'ai' ? 'bg-paper border border-line text-body' : 'bg-ink text-white'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {sub === 'sourcing' && <BooleanBuilder />}
      {sub === 'brand' && <EmployerBrandPanel />}
    </div>
  );
}

function BooleanBuilder() {
  const [roles, setRoles] = useState('Python developer, Java developer');
  const [mustHave, setMustHave] = useState('Django');
  const [locations, setLocations] = useState('Bangalore, Hyderabad');
  const [excludes, setExcludes] = useState('PHP, Hypertext Preprocessor');
  const [copied, setCopied] = useState(false);

  const splitTerms = (s) => s.split(',').map((t) => t.trim()).filter(Boolean);
  const roleList = splitTerms(roles);
  const locList = splitTerms(locations);
  const excludeList = splitTerms(excludes);

  const roleGroup = roleList.length > 1
    ? `(${roleList.map((r) => `"${r}"`).join(' OR ')})`
    : (roleList[0] ? `"${roleList[0]}"` : '');
  const locGroup = locList.length > 1 ? `(${locList.join(' OR ')})` : (locList[0] || '');
  const excludeStr = excludeList.map((e) => `NOT "${e}"`).join(' ');
  const query = [roleGroup, mustHave.trim() && `AND ${mustHave.trim()}`, locGroup && `AND ${locGroup}`, excludeStr]
    .filter(Boolean)
    .join(' ');

  const copy = () => {
    if (navigator.clipboard && query) {
      navigator.clipboard.writeText(query).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  const fields = [
    ['Role title(s), comma-separated (OR)', roles, setRoles],
    ['Must include (AND)', mustHave, setMustHave],
    ['Location(s), comma-separated (OR)', locations, setLocations],
    ['Exclude, comma-separated (NOT)', excludes, setExcludes],
  ];

  return (
    <Panel title="Boolean search builder" description="Builds a LinkedIn / job-board search string from role, must-have skill, location, and exclusions.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {fields.map(([label, value, setter]) => (
          <div key={label}>
            <label className="text-xs text-muted mb-1 block">{label}</label>
            <input
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full border border-line rounded-md px-3 py-2 text-sm bg-paper-raised text-body"
            />
          </div>
        ))}
      </div>
      <div className="bg-ink rounded-md p-4 relative">
        <code className="text-xs text-white leading-relaxed break-words pr-14 block">
          {query || 'Fill in at least one field above'}
        </code>
        <button
          onClick={copy}
          className="absolute top-2.5 right-2.5 text-xs text-white border border-white/30 rounded px-2 py-1 hover:bg-white/10 transition-colors"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-xs text-muted">
        <div><span className="text-body">" "</span> exact phrase</div>
        <div><span className="text-body">OR</span> match any</div>
        <div><span className="text-body">AND</span> must match too</div>
        <div><span className="text-body">NOT</span> exclude term</div>
      </div>
    </Panel>
  );
}

function EmployerBrandPanel() {
  return (
    <Panel title="Employer brand" description="What candidates are told about working here, and what the market says back.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {evpPillars.map((p) => (
          <div key={p.title} className="border border-line rounded-md p-3.5">
            <h4 className="text-body text-sm mb-1">{p.title}</h4>
            <p className="text-xs text-muted leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 border-t border-line pt-4">
        <Megaphone size={20} className="text-muted shrink-0" strokeWidth={1.75} />
        <div>
          <div className="font-display text-2xl text-ink">4.2 / 5</div>
          <div className="text-xs text-muted mt-0.5">average candidate-perception rating, trailing quarter — up from 3.9</div>
        </div>
      </div>
    </Panel>
  );
}

function SignalsTab() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? workplaceSignals : workplaceSignals.filter((s) => s.category === filter);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-ink mb-1">Workplace signals</h2>
        <p className="text-sm text-muted">Patterns the platform surfaces across recruitment and the current workforce, named the way HR teams talk about them today.</p>
      </div>

      <div className="flex gap-1 bg-paper border border-line rounded-md p-1 w-fit">
        <SegButton active={filter === 'all'} onClick={() => setFilter('all')}>All</SegButton>
        <SegButton active={filter === 'Recruitment'} onClick={() => setFilter('Recruitment')}>Recruitment</SegButton>
        <SegButton active={filter === 'Workforce'} onClick={() => setFilter('Workforce')}>Workforce</SegButton>
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <div key={s.term} className="border border-line rounded-md p-4 bg-paper-raised">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${s.category === 'Recruitment' ? 'text-amber border-amber' : 'text-teal border-teal'}`}>
                {s.term}
              </span>
              <span className="text-xs text-muted">{s.category}</span>
            </div>
            <p className="text-sm text-body leading-relaxed">{s.detail}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted leading-relaxed">
        These are informal workplace labels, not standardised HR metrics — useful for spotting patterns early, but any action
        taken should connect back to established measures like engagement, turnover intention, and organisational justice.
      </p>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-ink mb-1">HR analytics</h2>
        <p className="text-sm text-muted">Workforce signals that sit alongside recruitment — who's at risk of leaving, and how hiring is trending.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Attrition risk by department" description="Share of each department flagged at elevated risk.">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attritionByDept} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E1DA" vertical={false} />
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#62666F' }} axisLine={{ stroke: '#E4E1DA' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#62666F' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E4E1DA' }} />
                <Bar dataKey="risk" fill="#E0654A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Absenteeism rate" description="Monthly rate across the workforce.">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={absenteeismTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E1DA" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#62666F' }} axisLine={{ stroke: '#E4E1DA' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#62666F' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E4E1DA' }} />
                <Line type="monotone" dataKey="rate" stroke="#E8A33D" strokeWidth={2.5} dot={{ r: 3, fill: '#E8A33D' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Hiring funnel" description="Applied through to hired, current quarter.">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringFunnel} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E1DA" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#62666F' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: '#62666F' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E4E1DA' }} />
                <Bar dataKey="count" fill="#14213D" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Workforce by department" description="Current headcount, 280 total.">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={workforceComposition} dataKey="count" nameKey="dept" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {workforceComposition.map((entry, i) => (
                    <Cell key={entry.dept} fill={donutColors[i % donutColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E4E1DA' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            {workforceComposition.map((d, i) => (
              <div key={d.dept} className="flex items-center gap-1.5 text-xs text-muted">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: donutColors[i % donutColors.length] }} />
                {d.dept}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Skill-gap analysis" description="Required proficiency vs. what's currently available in-house, by capability area.">
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillGaps} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E1DA" vertical={false} />
              <XAxis dataKey="skill" tick={{ fontSize: 11, fill: '#62666F' }} axisLine={{ stroke: '#E4E1DA' }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#62666F' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E4E1DA' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="required" name="Required" fill="#D9D5CC" radius={[4, 4, 0, 0]} />
              <Bar dataKey="available" name="Available in-house" fill="#14213D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted mt-2">AI / ML shows the widest gap — the clearest case for either targeted hiring or a reskilling push.</p>
      </Panel>

      <Panel title="Employees flagged for a retention conversation" description="Risk flags are meant to prompt a supportive check-in, not an automated decision.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-line">
                <th className="font-normal py-2 pr-3">Role</th>
                <th className="font-normal py-2 pr-3">Department</th>
                <th className="font-normal py-2 pr-3">Risk</th>
                <th className="font-normal py-2">Key factor</th>
              </tr>
            </thead>
            <tbody>
              {atRiskEmployees.map((e, i) => {
                const band = riskBand(e.score);
                return (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="py-3 pr-3 text-body">{e.role}</td>
                    <td className="py-3 pr-3 text-muted">{e.dept}</td>
                    <td className={`py-3 pr-3 ${band.cls}`}>{band.label} · {e.score}</td>
                    <td className="py-3 text-muted">{e.factor}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Diversity in the hiring funnel" description="Share of women candidates at each stage.">
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deiFunnel} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E1DA" vertical={false} />
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#62666F' }} axisLine={{ stroke: '#E4E1DA' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#62666F' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E4E1DA' }} />
                <Bar dataKey="women" fill="#8B7355" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted mt-2">A steady narrowing from applied to hired is worth auditing for adverse impact.</p>
        </Panel>

        <Panel title="Onboarding & early tenure">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="font-display text-2xl text-ink">{onboardingKpis.retention90Day}%</div>
              <div className="text-xs text-muted mt-1">90-day retention</div>
            </div>
            <div>
              <div className="font-display text-2xl text-ink">{onboardingKpis.timeToProductivityWeeks}w</div>
              <div className="text-xs text-muted mt-1">avg. time to productivity</div>
            </div>
          </div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementByGeneration} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: '#62666F' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="group" tick={{ fontSize: 11, fill: '#62666F' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E4E1DA' }} />
                <Bar dataKey="score" fill="#2A8C7F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted mt-1">Engagement score by generation, current workforce.</p>
        </Panel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Panel title="Time-to-hire trend" description="Days from posting to offer accepted.">
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeToHireTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E1DA" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#62666F' }} axisLine={{ stroke: '#E4E1DA' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#62666F' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E4E1DA' }} />
                <Line type="monotone" dataKey="days" stroke="#2A8C7F" strokeWidth={2.5} dot={{ r: 3, fill: '#2A8C7F' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Cost per hire">
          <div className="flex items-center gap-3 h-full">
            <Wallet size={22} className="text-muted" strokeWidth={1.75} />
            <div>
              <div className="font-display text-3xl text-ink">₹42,000</div>
              <div className="text-sm text-muted mt-1">average, trailing quarter — down from ₹55,000 before AI screening</div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function AboutTab() {
  const items = [
    {
      title: 'Resume screening and matching',
      body: 'In a live build, this reads each resume with NLP \u2014 pulling out skills, titles, and years of experience \u2014 and compares it against the job description to produce a match percentage.',
    },
    {
      title: 'Candidate ranking',
      body: 'A weighted model combines the skills, experience, and education scores into one ranking. The weights would be set together with the hiring manager for each role.',
    },
    {
      title: 'Screening chatbot',
      body: 'A conversational agent asks structured follow-up questions and hands recruiters a written summary, so the first round takes minutes of review instead of a full call.',
    },
    {
      title: 'Attrition risk scoring',
      body: 'A predictive model trained on tenure, absenteeism, engagement survey results, and similar signals \u2014 flagging employees worth a supportive check-in before they consider leaving.',
    },
  ];
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-2xl text-ink mb-1">How this works</h2>
        <p className="text-sm text-muted leading-relaxed">
          Everything in this prototype — scores, conversations, and charts — runs on sample data, built to show the product experience end to end. Connecting it to
          real applicant and HR records, and training the underlying models on that data, would be the next phase of the build.
        </p>
      </div>
      <div className="space-y-5">
        {items.map((it) => (
          <div key={it.title} className="flex gap-3">
            <ShieldCheck size={18} className="text-teal shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <h3 className="text-body text-sm mb-1">{it.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{it.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================= ROOT ============================= */

export default function TalentSignalApp() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="ts-root min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        .ts-root{
          --ink:#14213D; --paper:#F7F7F4; --paper-raised:#FFFFFF; --line:#E4E1DA;
          --amber:#E8A33D; --teal:#2A8C7F; --coral:#E0654A;
          --text:#1F2430; --text-muted:#62666F;
          background:var(--paper); color:var(--text);
          font-family:'IBM Plex Sans', sans-serif;
        }
        .font-display{ font-family:'Space Grotesk', sans-serif; font-weight:600; }
        .text-ink{ color:var(--ink); } .bg-ink{ background:var(--ink); }
        .text-body{ color:var(--text); } .text-muted{ color:var(--text-muted); }
        .bg-paper{ background:var(--paper); } .bg-paper-raised{ background:var(--paper-raised); }
        .border-line{ border-color:var(--line); }
        .text-amber{ color:var(--amber); } .bg-amber{ background:var(--amber); } .border-amber{ border-color:var(--amber); }
        .text-teal{ color:var(--teal); } .bg-teal{ background:var(--teal); } .border-teal{ border-color:var(--teal); }
        .text-coral{ color:var(--coral); } .bg-coral{ background:var(--coral); }
      `}</style>

      <header className="border-b border-line bg-paper-raised sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-2 py-3.5">
            <span className="font-display text-lg text-ink">Talent Signal</span>
            <span className="text-xs text-muted border border-line rounded-full px-2 py-0.5">Prototype</span>
          </div>
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            <TabButton active={tab === 'overview'} onClick={() => setTab('overview')} icon={LayoutGrid}>Overview</TabButton>
            <TabButton active={tab === 'recruitment'} onClick={() => setTab('recruitment')} icon={Bot}>AI Recruitment</TabButton>
            <TabButton active={tab === 'signals'} onClick={() => setTab('signals')} icon={Radio}>Signals</TabButton>
            <TabButton active={tab === 'analytics'} onClick={() => setTab('analytics')} icon={BarChart3}>HR Analytics</TabButton>
            <TabButton active={tab === 'about'} onClick={() => setTab('about')} icon={BookOpen}>How it works</TabButton>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-7">
        {tab === 'overview' && <OverviewTab />}
        {tab === 'recruitment' && <RecruitmentTab />}
        {tab === 'signals' && <SignalsTab />}
        {tab === 'analytics' && <AnalyticsTab />}
        {tab === 'about' && <AboutTab />}
      </main>
    </div>
  );
}
