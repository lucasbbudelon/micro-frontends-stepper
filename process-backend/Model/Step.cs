using System;
using System.Collections.Generic;
using System.Linq;

namespace Model
{
    public class Step
    {
        public string CodeName { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public int Order { get; set; }
        public List<Field> Fields { get; set; }
        public bool Completed
        {
            get
            {
                if (Fields == null)
                {
                    return true;
                }
                else
                {
                    var requireds = Fields.Where(f => f.Required);
                    var requiredsCompleted = requireds.Where(f => !string.IsNullOrEmpty(f.Value));
                    return requireds.Count() == requiredsCompleted.Count();
                }
            }
        }
        public DateTime? LastAcess { get; set; }
        public DateTime? LastUpdate { get; set; }
    }
}
