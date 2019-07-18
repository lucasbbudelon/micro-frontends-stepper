using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class Field
    {
        public string CodeName { get; set; }
        public string Label { get; set; }
        public string Placeholder { get; set; }
        public string Value { get; set; }
        public string Type { get; set; }
        public bool Required { get; set; }
        public List<string> Options { get; set; }
        public Presentation Presentation { get; set; }
    }

    public class Presentation
    {
        public string Mask { get; set; }
        public string Pattern { get; set; }
        public string Prefix { get; set; }
        public string Sufix { get; set; }
    }
}
