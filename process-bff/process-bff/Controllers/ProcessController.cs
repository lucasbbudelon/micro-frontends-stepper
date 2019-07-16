using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model;

namespace process_bff.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcessController : ControllerBase
    {
        static List<Process> _listProcess;

        public ProcessController()
        {
            if (_listProcess == null)
            {
                _listProcess = new List<Process>
                {
                    new Process()
                    {
                        Id = 123,
                        Steps = GetSteps()
                    },
                    new Process()
                    {
                        Id = 456,
                        Steps = GetSteps()
                    }
                };
            }
        }

        // GET: api/process
        [HttpGet]
        public ActionResult<IEnumerable<Process>> Get()
        {
            return Ok(_listProcess);
        }

        // GET: api/process/123
        [HttpGet("{id}")]
        public ActionResult<Process> Get(int id)
        {
            var process = _listProcess.FirstOrDefault(p => p.Id == id);

            if (process == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(process);
            }
        }

        // GET: api/process/123/steps/document
        [HttpGet("{id}/steps/{idStep}")]
        public ActionResult<Process> GetStep(int id, string idStep)
        {
            var process = _listProcess.FirstOrDefault(p => p.Id == id);

            if (process == null)
            {
                return NotFound();
            }

            Step step;

            switch (idStep)
            {
                case "last":
                    step = process.Steps
                        .OrderBy(s => s.Order)
                        .OrderByDescending(s => s.LastAcess)
                        .FirstOrDefault();
                    break;

                case "current":
                    step = process.Steps
                        .Where(s => !s.Completed)
                        .OrderBy(s => s.Order)
                        .FirstOrDefault();
                    break;

                default:
                    step = process.Steps
                        .FirstOrDefault(s => s.Id.Equals(idStep));
                    break;
            }


            if (step == null)
            {
                return NotFound();
            }


            return Ok(step);
        }

        // Post: api/process
        [HttpPost]
        public ActionResult<Process> Post([FromBody] Process body)
        {
            body.Id = (new Random()).Next(111, 999);
            body.Steps = GetSteps();

            _listProcess.Add(body);

            return Ok(body);
        }

        // Put: api/process/123
        [HttpPut("{id}")]
        public ActionResult<Process> Put(int id, [FromBody] Process body)
        {
            var process = _listProcess.FirstOrDefault(p => p.Id == id);

            if (process == null)
            {
                return NotFound();
            }
            else
            {
                _listProcess.RemoveAll(p => p.Id == id);
                _listProcess.Add(body);

                return Ok(process);
            }
        }

        // Patch: api/process/123/step/document
        [HttpPatch("{id}/step/{idStep}")]
        public ActionResult<Process> Patch(int id, string idStep, [FromBody] Step step)
        {
            var process = _listProcess.FirstOrDefault(p => p.Id.Equals(id));

            if (process == null)
            {
                return NotFound();
            }
            else
            {
                _listProcess.RemoveAll(p => p.Id == id);

                process.Steps.RemoveAll(s => s.Id.Equals(idStep));
                process.Steps.Add(step);

                _listProcess.Add(process);

                return Ok(process);
            }
        }

        private List<Step> GetSteps()
        {
            return new List<Step>
                {
                    new Step()
                    {
                        Id = "document",
                        Name = "Documento de Identificação",
                        Type = StepType.Process,
                        Order = 1
                    },
                    new Step()
                    {
                        Id = "basic-data",
                        Name = "Dados Básicos",
                        Type = StepType.Process,
                        Order = 2
                    },
                    new Step()
                    {
                        Id = "address",
                        Name = "Endereço",
                        Type = StepType.Process,
                        Order = 3
                    },
                    new Step()
                    {
                        Id = "academic-data",
                        Name = "Dados Acadêmicos",
                        Type = StepType.Customization,
                        Url = "http://localhost:3000",
                        Order = 4
                    },
                    new Step()
                    {
                        Id = "professional-data",
                        Name = "Dados Profissionais",
                        Type = StepType.Customization,
                        Url = "http://localhost:4500",
                        Order = 5
                    },
                    new Step()
                    {
                        Id = "contract",
                        Name = "Contrato",
                        Type = StepType.Process,
                        Order = 6
                    },
                    new Step()
                    {
                        Id = "finalization",
                        Name = "Finalização",
                        Type = StepType.Process,
                        Order = 7
                    }
                };
        }
    }
}
