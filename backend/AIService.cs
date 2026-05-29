using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace ResumeBuilder;

public class AIService
{
    private readonly HttpClient _http;

    public AIService(HttpClient http)
    {
        _http = http;
        _http.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
    }

    public async Task<ProjectInfoResult> GetProjectInfoAsync(string projectName)
    {
        // 1. Try to fetch info from Wikipedia or DuckDuckGo
        var searchResult = await SearchWebAsync(projectName);

        // 2. Build description from search result or use smart templates
        var result = BuildProjectDescription(projectName, searchResult);

        return result;
    }

    // ── Web Search via DuckDuckGo Instant Answer API (free, no key) ──
    private async Task<string> SearchWebAsync(string projectName)
    {
        try
        {
            var query = Uri.EscapeDataString(projectName + " project computer science");
            var url = $"https://api.duckduckgo.com/?q={query}&format=json&no_html=1&skip_disambig=1";

            var response = await _http.GetAsync(url);
            if (!response.IsSuccessStatusCode) return "";

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            // Try Abstract first
            if (root.TryGetProperty("Abstract", out var abs) && abs.GetString()?.Length > 30)
                return abs.GetString()!;

            // Try RelatedTopics
            if (root.TryGetProperty("RelatedTopics", out var topics) && topics.ValueKind == JsonValueKind.Array)
            {
                foreach (var topic in topics.EnumerateArray())
                {
                    if (topic.TryGetProperty("Text", out var text) && text.GetString()?.Length > 30)
                        return text.GetString()!;
                }
            }

            return "";
        }
        catch
        {
            return "";
        }
    }

    // ── Smart Template Engine ──
    private ProjectInfoResult BuildProjectDescription(string projectName, string webInfo)
    {
        var name = projectName.Trim();
        var nameLower = name.ToLower();

        // Detect domain keywords
        var domain = DetectDomain(nameLower);

        // Pick action verb
        var verb = PickVerb(nameLower);

        // Build description
        string description;
        string technologies;

        if (!string.IsNullOrWhiteSpace(webInfo) && webInfo.Length > 40)
        {
            // Use web info as base, rewrite in resume style
            var snippet = webInfo.Length > 200 ? webInfo[..200] + "..." : webInfo;
            description =
                $"{verb} a {name} that {snippet.ToLower().TrimStart()} " +
                $"Implemented {domain.CoreFeature} with focus on performance and scalability. " +
                $"Delivered a fully functional {domain.AppType} solution with clean architecture and documentation.";
            technologies = domain.Technologies;
        }
        else
        {
            // Full template-based description
            description = domain.Description.Replace("{NAME}", name).Replace("{VERB}", verb);
            technologies = domain.Technologies;
        }

        // Clean up description
        description = CleanDescription(description);

        return new ProjectInfoResult
        {
            Description = description,
            Technologies = technologies
        };
    }

    private DomainInfo DetectDomain(string nameLower)
    {
        // Recommendation Systems
        if (nameLower.Contains("recommend"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} using collaborative filtering and content-based algorithms to provide personalized suggestions. Implemented user preference tracking, similarity scoring, and real-time recommendation engine. Integrated a RESTful API backend with a responsive frontend dashboard to deliver accurate and scalable suggestions.",
                Technologies = "Python, Scikit-learn, Pandas, Flask, MySQL, HTML/CSS, JavaScript",
                CoreFeature = "recommendation algorithms and user preference modeling",
                AppType = "recommendation engine"
            };

        // Machine Learning / AI
        if (nameLower.Contains("ml") || nameLower.Contains("machine learning") ||
            nameLower.Contains("predict") || nameLower.Contains("classif") ||
            nameLower.Contains("detection") || nameLower.Contains("recognition"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} leveraging machine learning algorithms to analyze data patterns and deliver accurate predictions. Preprocessed and cleaned large datasets, trained and evaluated multiple models, and deployed the best-performing model via a REST API. Achieved measurable improvements in accuracy through hyperparameter tuning and cross-validation.",
                Technologies = "Python, Scikit-learn, TensorFlow/Keras, Pandas, NumPy, Flask, Matplotlib",
                CoreFeature = "ML model training, evaluation, and deployment pipeline",
                AppType = "machine learning application"
            };

        // Chat / Messaging
        if (nameLower.Contains("chat") || nameLower.Contains("messag") || nameLower.Contains("communication"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} enabling real-time communication between users with instant message delivery. Implemented WebSocket-based bidirectional communication, user authentication with JWT tokens, message history storage, and online/offline status indicators. Designed a responsive UI supporting multiple chat rooms and direct messaging.",
                Technologies = "Node.js, Socket.io, Express.js, MongoDB, React, JWT, HTML/CSS",
                CoreFeature = "real-time WebSocket messaging and user session management",
                AppType = "real-time chat application"
            };

        // E-commerce / Shopping
        if (nameLower.Contains("ecommerce") || nameLower.Contains("e-commerce") ||
            nameLower.Contains("shop") || nameLower.Contains("store") || nameLower.Contains("market"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} with full product catalog, shopping cart, and secure checkout functionality. Implemented user authentication, product search and filtering, inventory management, and payment gateway integration. Built an admin dashboard for order tracking, product management, and sales analytics.",
                Technologies = "React, Node.js, Express.js, MongoDB, Stripe API, JWT, Redux, CSS",
                CoreFeature = "product management, cart system, and secure payment processing",
                AppType = "e-commerce platform"
            };

        // Healthcare / Hospital
        if (nameLower.Contains("health") || nameLower.Contains("hospital") ||
            nameLower.Contains("medical") || nameLower.Contains("patient") || nameLower.Contains("doctor"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} to streamline healthcare workflows including patient registration, appointment scheduling, and medical record management. Implemented role-based access control for doctors, nurses, and administrators. Integrated appointment reminders and a secure dashboard for real-time patient data monitoring.",
                Technologies = "Java, Spring Boot, MySQL, Hibernate, React, Bootstrap, REST API",
                CoreFeature = "patient management, appointment scheduling, and role-based access control",
                AppType = "healthcare management system"
            };

        // Banking / Finance
        if (nameLower.Contains("bank") || nameLower.Contains("financ") ||
            nameLower.Contains("payment") || nameLower.Contains("wallet") || nameLower.Contains("transaction"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} enabling secure financial transactions, account management, and real-time balance tracking. Implemented multi-factor authentication, encrypted data storage, transaction history with filtering, and fraud detection alerts. Designed an intuitive dashboard displaying spending analytics and account summaries.",
                Technologies = "Java, Spring Boot, MySQL, Spring Security, React, REST API, JWT",
                CoreFeature = "secure transaction processing and account management",
                AppType = "financial management application"
            };

        // Inventory / Management System
        if (nameLower.Contains("inventory") || nameLower.Contains("management system") ||
            nameLower.Contains("erp") || nameLower.Contains("crm"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} to automate tracking, reporting, and management of business resources. Implemented CRUD operations for items/entities, real-time stock alerts, report generation, and role-based user access. Integrated data visualization dashboards to provide actionable business insights.",
                Technologies = "Python, Django, PostgreSQL, React, Chart.js, Bootstrap, REST API",
                CoreFeature = "resource tracking, reporting, and role-based access management",
                AppType = "management system"
            };

        // Face / Image Recognition
        if (nameLower.Contains("face") || nameLower.Contains("image") ||
            nameLower.Contains("vision") || nameLower.Contains("ocr"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} using computer vision techniques to detect, process, and analyze visual data in real time. Trained a deep learning model on labeled image datasets, achieving high accuracy in recognition tasks. Integrated the model into a web interface enabling live camera feed processing and result visualization.",
                Technologies = "Python, OpenCV, TensorFlow, Keras, NumPy, Flask, HTML/CSS, JavaScript",
                CoreFeature = "image preprocessing, model training, and real-time inference",
                AppType = "computer vision application"
            };

        // Web Scraping / Data Collection
        if (nameLower.Contains("scraper") || nameLower.Contains("scraping") ||
            nameLower.Contains("crawler") || nameLower.Contains("data collect"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} to automate extraction of structured data from web sources at scale. Implemented dynamic page handling with headless browsers, data cleaning pipelines, and automated scheduling. Stored extracted data in a structured database with an API layer for downstream consumption.",
                Technologies = "Python, BeautifulSoup, Scrapy, Selenium, PostgreSQL, Pandas, Flask",
                CoreFeature = "automated web data extraction and structured storage pipeline",
                AppType = "data collection tool"
            };

        // Social Media / Networking
        if (nameLower.Contains("social") || nameLower.Contains("network") ||
            nameLower.Contains("connect") || nameLower.Contains("community"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} allowing users to create profiles, share posts, follow others, and interact through comments and likes. Implemented real-time notifications, content feed algorithm, media uploads, and privacy settings. Built a responsive interface with infinite scroll and optimized API performance for high user concurrency.",
                Technologies = "React, Node.js, Express.js, MongoDB, Socket.io, JWT, Cloudinary, CSS",
                CoreFeature = "user interaction, content feed, and real-time notifications",
                AppType = "social networking platform"
            };

        // Student / Education
        if (nameLower.Contains("student") || nameLower.Contains("education") ||
            nameLower.Contains("school") || nameLower.Contains("learn") || nameLower.Contains("course"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} to manage academic workflows including student enrollment, course registration, attendance tracking, and grade management. Implemented separate dashboards for students, faculty, and administrators with role-based permissions. Automated report generation and email notifications for academic events.",
                Technologies = "Java, Spring Boot, MySQL, React, Bootstrap, REST API, JUnit",
                CoreFeature = "student data management, course tracking, and automated reporting",
                AppType = "educational management system"
            };

        // IoT / Smart Systems
        if (nameLower.Contains("iot") || nameLower.Contains("smart") ||
            nameLower.Contains("sensor") || nameLower.Contains("embedded") || nameLower.Contains("arduino"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} integrating IoT sensors with a cloud platform to enable real-time monitoring and automated control. Implemented MQTT-based communication between devices, a time-series data storage layer, and a live dashboard for sensor data visualization and threshold-based alerts.",
                Technologies = "Python, Arduino, MQTT, Node.js, InfluxDB, Grafana, React, REST API",
                CoreFeature = "sensor data acquisition, real-time processing, and remote control",
                AppType = "IoT monitoring solution"
            };

        // Blockchain / Crypto
        if (nameLower.Contains("blockchain") || nameLower.Contains("crypto") ||
            nameLower.Contains("nft") || nameLower.Contains("smart contract") || nameLower.Contains("defi"))
            return new DomainInfo
            {
                Description = "{VERB} a {NAME} on a blockchain network enabling decentralized, transparent, and tamper-proof transactions. Developed and deployed Solidity smart contracts, implemented wallet integration, and built a frontend interface for interacting with the blockchain. Ensured security through contract auditing and gas optimization.",
                Technologies = "Solidity, Ethereum, Web3.js, React, MetaMask, Hardhat, Node.js",
                CoreFeature = "smart contract development and decentralized transaction management",
                AppType = "blockchain application"
            };

        // Default / Generic
        return new DomainInfo
        {
            Description = "{VERB} a {NAME} to address real-world challenges through a robust full-stack solution. Designed and implemented core modules including data management, business logic, and a user-friendly interface. Followed best practices in software engineering including modular architecture, version control, and comprehensive testing to ensure reliability and maintainability.",
            Technologies = "Python / Java, HTML, CSS, JavaScript, MySQL / MongoDB, REST API, Git",
            CoreFeature = "core business logic, data management, and user interface",
            AppType = "software application"
        };
    }

    private string PickVerb(string nameLower)
    {
        if (nameLower.Contains("system") || nameLower.Contains("platform")) return "Engineered";
        if (nameLower.Contains("app") || nameLower.Contains("application")) return "Built";
        if (nameLower.Contains("tool") || nameLower.Contains("utility")) return "Developed";
        if (nameLower.Contains("model") || nameLower.Contains("network")) return "Designed";
        if (nameLower.Contains("analysis") || nameLower.Contains("analytics")) return "Implemented";
        return "Developed";
    }

    private string CleanDescription(string desc)
    {
        // Remove double spaces and fix punctuation
        desc = Regex.Replace(desc, @"\s{2,}", " ");
        desc = desc.Trim();
        if (!desc.EndsWith(".")) desc += ".";
        return desc;
    }
}

public class DomainInfo
{
    public string Description { get; set; } = "";
    public string Technologies { get; set; } = "";
    public string CoreFeature { get; set; } = "";
    public string AppType { get; set; } = "";
}

public class ProjectInfoResult
{
    public string Description { get; set; } = "";
    public string Technologies { get; set; } = "";
}