using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://127.0.0.1:5500")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllersWithViews();
var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseStaticFiles();
app.UseRouting();
app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();

public class Person
{
    public required string ID { get; set; }
    public required string Ime { get; set; }
    public required string Priimek { get; set; }
    public required int Starost { get; set; }
    public required string Naziv { get; set; }
    public required string Raven { get; set; }

}

[ApiController]
[Route("api/osebe")]
public class PersonController : ControllerBase
{
    private static string potDatoteke = "osebe.JSON";

    private List<Person> ReadPeopleFromFile()
    {
        if (System.IO.File.Exists(potDatoteke))
        {
            try
            {
                var jsonPodatki = System.IO.File.ReadAllText(potDatoteke);
                return JsonSerializer.Deserialize<List<Person>>(jsonPodatki) ?? new List<Person>();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error reading file: " + ex.Message);
            }
        }
        return new List<Person>();
    }

    private void WritePeopleToFile(List<Person> osebe)
    {
        var jsonPodatki = JsonSerializer.Serialize(osebe);
        System.IO.File.WriteAllText(potDatoteke, jsonPodatki);
    }

    [HttpGet]
    public IActionResult GetPeople()
    {
        var osebe = ReadPeopleFromFile();
        return Ok(new { st = osebe.Count, seznam = osebe });
    }

    [HttpPost]
    public IActionResult AddPerson([FromBody] Person oseba)
    {
        var osebe = ReadPeopleFromFile();

        var obstojecaOseba = osebe.FirstOrDefault(p => p.ID == oseba.ID);

        if (obstojecaOseba != null)
        {
            return BadRequest("ID že obstaja.");
        }

        if (oseba.Starost < 18 || oseba.Starost > 100)
        {
            return BadRequest("Starost mora biti med 18 in 100 let.");
        }

        osebe.Add(oseba);
        WritePeopleToFile(osebe);
        return Ok(new { st = osebe.Count, seznam = osebe });
    }
}
