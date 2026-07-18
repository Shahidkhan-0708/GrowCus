# Feature: Risk Management

Growcus includes an automated academic risk calculation engine to identify students who are falling behind, allowing teachers to intervene before it's too late.

## Business Logic

The risk system relies on the `controllers/risk.js` and the `Riskscore` model.

### The Algorithm
While the specific weights can be adjusted, the risk algorithm generally evaluates:
1. **Attendance**: Low attendance increases risk.
2. **Average Score**: A steep drop in recent scores or a consistently failing average heavily weights the risk.
3. **Task Completion Rate**: Pending vs Completed tasks.

### Outputs
The system categorizes students into three buckets:
- **Low Risk**: Doing well, minimal intervention needed.
- **Medium Risk**: Needs monitoring.
- **High Risk**: Requires immediate teacher intervention.

### Interventions
Teachers can log an `Intervention` (via the `Intervention` model) when they speak with a high-risk student. This tracks the effectiveness of the system over time.

## Code References

- **Routes**: `routes/risk.js`
- **Controller**: `controllers/risk.js` (`getRiskDistribution`)
- **Models**: `models/Riskscore.js`, `models/Intervention.js`

---

**Related:**
- [[Database]]
