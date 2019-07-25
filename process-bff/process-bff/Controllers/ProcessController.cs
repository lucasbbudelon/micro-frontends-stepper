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
        [HttpGet("{id}/steps/{codeName}")]
        public ActionResult<Process> GetStep(int id, string codeName)
        {
            var process = _listProcess.FirstOrDefault(p => p.Id == id);
            if (process == null)
            {
                return NotFound();
            }

            var step = process.Steps.FirstOrDefault(s => s.CodeName.Equals(codeName)); ;
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
            body.LastUpdate = DateTime.Now;

            _listProcess.Add(body);

            return Ok(body);
        }

        // Put: api/process/123
        //[HttpPut("{id}")]
        //public ActionResult<Process> Put(int id, [FromBody] Process body)
        //{
        //    var process = _listProcess.FirstOrDefault(p => p.Id == id);

        //    if (process == null)
        //    {
        //        return NotFound();
        //    }
        //    else
        //    {
        //        _listProcess.RemoveAll(p => p.Id == id);

        //        body.LastUpdate = DateTime.Now;

        //        _listProcess.Add(body);

        //        return Ok(process);
        //    }
        //}

        // Patch: api/process/123/step/document
        [HttpPatch("{id}/step/{codeName}")]
        public ActionResult<Process> Patch(int id, string codeName, [FromBody] Step step)
        {
            var process = _listProcess.FirstOrDefault(p => p.Id.Equals(id));

            if (process == null)
            {
                return NotFound();
            }
            else
            {
                _listProcess.RemoveAll(p => p.Id == id);

                process.Steps.RemoveAll(s => s.CodeName.Equals(codeName));
                process.Steps.Add(step);
                process.LastUpdate = DateTime.Now;

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
                        CodeName = "document",
                        Title = "Documento de Identificação",
                        Order = 1,
                        Fields = new List<Field>()
                        {
                            new Field()
                            {
                                CodeName = "document-type",
                                Label = "Tipo",
                                Placeholder = "Selecione o tipo do documento",
                                Required = true,
                                Options = new List<string>() { "RG", "CNH"}
                            },
                            new Field()
                            {
                                CodeName = "document-number",
                                Label = "Número do documento",
                                Placeholder = "Informe o número do documento",
                                Required = true,
                                Type = "text"
                            }
                        }
                    },
                    new Step()
                    {
                        CodeName = "basic-data",
                        Title = "Dados Básicos",
                        Order = 2,
                        Fields = new List<Field>()
                        {
                            new Field()
                            {
                                CodeName = "name",
                                Label = "Nome completo",
                                Placeholder = "Ex.: João Silva dos Santos",
                                Required = true,
                                Type = "text"
                            },
                            new Field()
                            {
                                CodeName = "mother-name",
                                Label = "Nome da mãe",
                                Placeholder = "Ex.: Maria da Silva",
                                Required = true,
                                Type = "text"
                            },
                            new Field()
                            {
                                CodeName = "father-name",
                                Label = "Nome do pai",
                                Placeholder = "Ex.: José dos Santos",
                                Required = false,
                            },
                            new Field()
                            {
                                CodeName = "profession",
                                Label = "Profissão",
                                Placeholder = "Ex.: Desenvolvedor de Software",
                                Required = true,
                            },
                            new Field()
                            {
                                CodeName = "naturalness",
                                Label = "Naturalidade",
                                Placeholder = "Ex.: Porto Alegre, Brasil",
                                Required = false,
                            }
                        }
                    },
                    new Step()
                    {
                        CodeName = "address",
                        Title = "Endereço",
                        Order = 3,
                        Fields = new List<Field>()
                        {
                            new Field()
                            {
                                CodeName = "address-description",
                                Label = "Endereço",
                                Placeholder = "Ex.: Av. Ipiranga, 6681",
                                Required = true,
                                Type = "text"
                            },
                            new Field()
                            {
                                CodeName = "address-complement",
                                Label = "Complemento",
                                Placeholder = "Ex.: TECNOPUC, prédio 32",
                                Required = false,
                                Type = "text"
                            },
                            new Field()
                            {
                                CodeName = "address-neighborhood",
                                Label = "Bairro",
                                Placeholder = "Ex.: Partenon",
                                Required = true,
                                Type = "text"
                            },
                            new Field()
                            {
                                CodeName = "address-city",
                                Label = "Cidade",
                                Placeholder = "Ex.: Porto Alegre",
                                Required = true,
                                Type = "text"
                            },
                            new Field()
                            {
                                CodeName = "address-state",
                                Label = "Estado",
                                Placeholder = "Ex.: Rio Grande do Sul",
                                Required = true,
                                Type = "text"
                            }
                        }
                    },
                    new Step()
                    {
                        CodeName = "time-experience",
                        Title = "Tempo de Experiência",
                        Url = "http://localhost:3000",
                        Order = 4,
                        Fields = new List<Field>()
                        {
                            new Field()
                            {
                                CodeName = "experience-code",
                                Label = "Código",
                                Required = true
                            }
                        }
                    },
                    new Step()
                    {
                        CodeName = "promotional-package",
                        Title = "Pacote promocional",
                        Url = "http://localhost:4500",
                        Order = 5,
                        Fields = new List<Field>()
                        {
                            new Field()
                            {
                                CodeName = "package-code",
                                Label = "Código",
                                Required = true
                            }
                        }
                    },
                    new Step()
                    {
                        CodeName = "contract",
                        Title = "Contrato",
                        Order = 6,
                        Fields = new List<Field>()
                        {
                            new Field()
                            {
                                CodeName = "date-signature",
                                Label = "Data da assinatura",
                                Required = true
                            }
                        }
                    }
                };
        }
    }
}
