using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class Process
    {
        public int Id { get; set; }
        public List<Step> Steps { get; set; }
        public Step CurrentStep
        {
            get
            {
                return Steps?
                    .OrderBy(step => step.Order)
                    .OrderByDescending(step => step.LastAcess)
                    .FirstOrDefault();
            }
        }
        public Step NextStep
        {
            get
            {
                if (Steps == null)
                {
                    return null;
                }
                else
                {
                    var stepsOrderBy = Steps.OrderBy(s => s.Order).ToList();
                    var indexCurrent = stepsOrderBy.IndexOf(CurrentStep);
                    return stepsOrderBy.ElementAtOrDefault(indexCurrent + 1);
                }
            }
        }
        public Step BackStep
        {
            get
            {
                if (Steps == null)
                {
                    return null;
                }
                else
                {
                    var stepsOrderBy = Steps.OrderBy(s => s.Order).ToList();
                    var indexCurrent = stepsOrderBy.IndexOf(CurrentStep);
                    return stepsOrderBy.ElementAtOrDefault(indexCurrent - 1);
                }
            }
        }
        public DateTime? LastUpdate { get; set; }
    }
}
