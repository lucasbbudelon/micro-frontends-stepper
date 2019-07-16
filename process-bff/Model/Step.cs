using System;

namespace Model
{
    public class Step
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public StepType Type { get; set; }
        public int Order { get; set; }
        public bool Completed { get; set; }
        public DateTime? LastAcess { get; set; }
        public DateTime? LastUpdate { get; set; }
    }

    public enum StepType
    {
        Process = 1,
        Customization = 2
    }
}
