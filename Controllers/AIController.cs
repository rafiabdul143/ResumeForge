using Microsoft.AspNetCore.Mvc;

namespace ResumeBuilder.Controllers;

[ApiController]
[Route("api/ai")]
public class AIController : ControllerBase
{
    private readonly AIService _aiService;
    private readonly ILogger<AIController> _logger;

    public AIController(AIService aiService, ILogger<AIController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    [HttpPost("project-info")]
    public async Task<IActionResult> GetProjectInfo([FromBody] ProjectInfoRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.ProjectName))
            return BadRequest(new { error = "Project name is required." });

        try
        {
            var result = await _aiService.GetProjectInfoAsync(request.ProjectName);
            return Ok(new
            {
                description = result.Description,
                technologies = result.Technologies
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error for project: {Project}", request.ProjectName);
            return StatusCode(500, new { error = "Service unavailable. Try again." });
        }
    }
}

public class ProjectInfoRequest
{
    public string? ProjectName { get; set; }
}