from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any


HOST = "127.0.0.1"
PORT = 5258


@dataclass(frozen=True)
class DomainInfo:
    description: str
    technologies: str
    core_feature: str
    app_type: str


@dataclass(frozen=True)
class ProjectInfoResult:
    description: str
    technologies: str


def search_web(project_name: str) -> str:
    query = urllib.parse.quote_plus(f"{project_name} project computer science")
    url = (
        "https://api.duckduckgo.com/"
        f"?q={query}&format=json&no_html=1&skip_disambig=1"
    )

    try:
        request = urllib.request.Request(
            url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36"
                )
            },
        )

        with urllib.request.urlopen(request, timeout=5) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except Exception:
        return ""

    abstract = payload.get("Abstract", "")
    if isinstance(abstract, str) and len(abstract) > 30:
        return abstract

    related_topics = payload.get("RelatedTopics", [])
    if isinstance(related_topics, list):
        for topic in related_topics:
            if not isinstance(topic, dict):
                continue

            text = topic.get("Text", "")
            if isinstance(text, str) and len(text) > 30:
                return text

    return ""


def get_project_info(project_name: str) -> ProjectInfoResult:
    web_info = search_web(project_name)
    return build_project_description(project_name, web_info)


def build_project_description(project_name: str, web_info: str) -> ProjectInfoResult:
    name = project_name.strip()
    name_lower = name.lower()
    domain = detect_domain(name_lower)
    verb = pick_verb(name_lower)

    if web_info and len(web_info) > 40:
        snippet = web_info[:200] + "..." if len(web_info) > 200 else web_info
        description = (
            f"{verb} a {name} that {snippet.lower().lstrip()} "
            f"Implemented {domain.core_feature} with focus on performance and "
            f"scalability. Delivered a fully functional {domain.app_type} solution "
            "with clean architecture and documentation."
        )
    else:
        description = domain.description.replace("{NAME}", name).replace("{VERB}", verb)

    return ProjectInfoResult(
        description=clean_description(description),
        technologies=domain.technologies,
    )


def detect_domain(name_lower: str) -> DomainInfo:
    if "recommend" in name_lower:
        return DomainInfo(
            description=(
                "{VERB} a {NAME} using collaborative filtering and content-based "
                "algorithms to provide personalized suggestions. Implemented user "
                "preference tracking, similarity scoring, and real-time recommendation "
                "engine. Integrated a RESTful API backend with a responsive frontend "
                "dashboard to deliver accurate and scalable suggestions."
            ),
            technologies="Python, Scikit-learn, Pandas, Flask, MySQL, HTML/CSS, JavaScript",
            core_feature="recommendation algorithms and user preference modeling",
            app_type="recommendation engine",
        )

    if any(
        keyword in name_lower
        for keyword in (
            "ml",
            "machine learning",
            "predict",
            "classif",
            "detection",
            "recognition",
        )
    ):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} leveraging machine learning algorithms to analyze "
                "data patterns and deliver accurate predictions. Preprocessed and "
                "cleaned large datasets, trained and evaluated multiple models, and "
                "deployed the best-performing model via a REST API. Achieved measurable "
                "improvements in accuracy through hyperparameter tuning and "
                "cross-validation."
            ),
            technologies="Python, Scikit-learn, TensorFlow/Keras, Pandas, NumPy, Flask, Matplotlib",
            core_feature="ML model training, evaluation, and deployment pipeline",
            app_type="machine learning application",
        )

    if any(keyword in name_lower for keyword in ("chat", "messag", "communication")):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} enabling real-time communication between users with "
                "instant message delivery. Implemented WebSocket-based bidirectional "
                "communication, user authentication with JWT tokens, message history "
                "storage, and online/offline status indicators. Designed a responsive "
                "UI supporting multiple chat rooms and direct messaging."
            ),
            technologies="Node.js, Socket.io, Express.js, MongoDB, React, JWT, HTML/CSS",
            core_feature="real-time WebSocket messaging and user session management",
            app_type="real-time chat application",
        )

    if any(
        keyword in name_lower
        for keyword in ("ecommerce", "e-commerce", "shop", "store", "market")
    ):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} with full product catalog, shopping cart, and secure "
                "checkout functionality. Implemented user authentication, product "
                "search and filtering, inventory management, and payment gateway "
                "integration. Built an admin dashboard for order tracking, product "
                "management, and sales analytics."
            ),
            technologies="React, Node.js, Express.js, MongoDB, Stripe API, JWT, Redux, CSS",
            core_feature="product management, cart system, and secure payment processing",
            app_type="e-commerce platform",
        )

    if any(
        keyword in name_lower
        for keyword in ("health", "hospital", "medical", "patient", "doctor")
    ):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} to streamline healthcare workflows including patient "
                "registration, appointment scheduling, and medical record management. "
                "Implemented role-based access control for doctors, nurses, and "
                "administrators. Integrated appointment reminders and a secure dashboard "
                "for real-time patient data monitoring."
            ),
            technologies="Java, Spring Boot, MySQL, Hibernate, React, Bootstrap, REST API",
            core_feature="patient management, appointment scheduling, and role-based access control",
            app_type="healthcare management system",
        )

    if any(
        keyword in name_lower
        for keyword in ("bank", "financ", "payment", "wallet", "transaction")
    ):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} enabling secure financial transactions, account "
                "management, and real-time balance tracking. Implemented multi-factor "
                "authentication, encrypted data storage, transaction history with "
                "filtering, and fraud detection alerts. Designed an intuitive dashboard "
                "displaying spending analytics and account summaries."
            ),
            technologies="Java, Spring Boot, MySQL, Spring Security, React, REST API, JWT",
            core_feature="secure transaction processing and account management",
            app_type="financial management application",
        )

    if any(
        keyword in name_lower
        for keyword in ("inventory", "management system", "erp", "crm")
    ):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} to automate tracking, reporting, and management of "
                "business resources. Implemented CRUD operations for items/entities, "
                "real-time stock alerts, report generation, and role-based user access. "
                "Integrated data visualization dashboards to provide actionable business "
                "insights."
            ),
            technologies="Python, Django, PostgreSQL, React, Chart.js, Bootstrap, REST API",
            core_feature="resource tracking, reporting, and role-based access management",
            app_type="management system",
        )

    if any(keyword in name_lower for keyword in ("face", "image", "vision", "ocr")):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} using computer vision techniques to detect, process, "
                "and analyze visual data in real time. Trained a deep learning model "
                "on labeled image datasets, achieving high accuracy in recognition "
                "tasks. Integrated the model into a web interface enabling live camera "
                "feed processing and result visualization."
            ),
            technologies="Python, OpenCV, TensorFlow, Keras, NumPy, Flask, HTML/CSS, JavaScript",
            core_feature="image preprocessing, model training, and real-time inference",
            app_type="computer vision application",
        )

    if any(
        keyword in name_lower
        for keyword in ("scraper", "scraping", "crawler", "data collect")
    ):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} to automate extraction of structured data from web "
                "sources at scale. Implemented dynamic page handling with headless "
                "browsers, data cleaning pipelines, and automated scheduling. Stored "
                "extracted data in a structured database with an API layer for "
                "downstream consumption."
            ),
            technologies="Python, BeautifulSoup, Scrapy, Selenium, PostgreSQL, Pandas, Flask",
            core_feature="automated web data extraction and structured storage pipeline",
            app_type="data collection tool",
        )

    if any(
        keyword in name_lower
        for keyword in ("social", "network", "connect", "community")
    ):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} allowing users to create profiles, share posts, "
                "follow others, and interact through comments and likes. Implemented "
                "real-time notifications, content feed algorithm, media uploads, and "
                "privacy settings. Built a responsive interface with infinite scroll "
                "and optimized API performance for high user concurrency."
            ),
            technologies="React, Node.js, Express.js, MongoDB, Socket.io, JWT, Cloudinary, CSS",
            core_feature="user interaction, content feed, and real-time notifications",
            app_type="social networking platform",
        )

    if any(
        keyword in name_lower
        for keyword in ("student", "education", "school", "learn", "course")
    ):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} to manage academic workflows including student "
                "enrollment, course registration, attendance tracking, and grade "
                "management. Implemented separate dashboards for students, faculty, "
                "and administrators with role-based permissions. Automated report "
                "generation and email notifications for academic events."
            ),
            technologies="Java, Spring Boot, MySQL, React, Bootstrap, REST API, JUnit",
            core_feature="student data management, course tracking, and automated reporting",
            app_type="educational management system",
        )

    if any(
        keyword in name_lower
        for keyword in ("iot", "smart", "sensor", "embedded", "arduino")
    ):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} integrating IoT sensors with a cloud platform to "
                "enable real-time monitoring and automated control. Implemented "
                "MQTT-based communication between devices, a time-series data storage "
                "layer, and a live dashboard for sensor data visualization and "
                "threshold-based alerts."
            ),
            technologies="Python, Arduino, MQTT, Node.js, InfluxDB, Grafana, React, REST API",
            core_feature="sensor data acquisition, real-time processing, and remote control",
            app_type="IoT monitoring solution",
        )

    if any(
        keyword in name_lower
        for keyword in ("blockchain", "crypto", "nft", "smart contract", "defi")
    ):
        return DomainInfo(
            description=(
                "{VERB} a {NAME} on a blockchain network enabling decentralized, "
                "transparent, and tamper-proof transactions. Developed and deployed "
                "Solidity smart contracts, implemented wallet integration, and built "
                "a frontend interface for interacting with the blockchain. Ensured "
                "security through contract auditing and gas optimization."
            ),
            technologies="Solidity, Ethereum, Web3.js, React, MetaMask, Hardhat, Node.js",
            core_feature="smart contract development and decentralized transaction management",
            app_type="blockchain application",
        )

    return DomainInfo(
        description=(
            "{VERB} a {NAME} to address real-world challenges through a robust "
            "full-stack solution. Designed and implemented core modules including data "
            "management, business logic, and a user-friendly interface. Followed best "
            "practices in software engineering including modular architecture, version "
            "control, and comprehensive testing to ensure reliability and "
            "maintainability."
        ),
        technologies="Python / Java, HTML, CSS, JavaScript, MySQL / MongoDB, REST API, Git",
        core_feature="core business logic, data management, and user interface",
        app_type="software application",
    )


def pick_verb(name_lower: str) -> str:
    if "system" in name_lower or "platform" in name_lower:
        return "Engineered"
    if "app" in name_lower or "application" in name_lower:
        return "Built"
    if "tool" in name_lower or "utility" in name_lower:
        return "Developed"
    if "model" in name_lower or "network" in name_lower:
        return "Designed"
    if "analysis" in name_lower or "analytics" in name_lower:
        return "Implemented"
    return "Developed"


def clean_description(description: str) -> str:
    cleaned = re.sub(r"\s{2,}", " ", description).strip()
    if not cleaned.endswith("."):
        cleaned += "."
    return cleaned


class ResumeBuilderHandler(BaseHTTPRequestHandler):
    server_version = "ResumeBuilderPython/1.0"

    def do_OPTIONS(self) -> None:
        self.send_json({}, status=204)

    def do_GET(self) -> None:
        if self.path == "/health":
            self.send_json({"status": "ok", "service": "resume-builder-python"})
            return

        self.send_json({"error": "Not found."}, status=404)

    def do_POST(self) -> None:
        if self.path != "/api/ai/project-info":
            self.send_json({"error": "Not found."}, status=404)
            return

        try:
            payload = self.read_json()
        except ValueError:
            self.send_json({"error": "Invalid JSON body."}, status=400)
            return

        project_name = payload.get("projectName")
        if not isinstance(project_name, str) or not project_name.strip():
            self.send_json({"error": "Project name is required."}, status=400)
            return

        result = get_project_info(project_name)
        self.send_json(
            {
                "description": result.description,
                "technologies": result.technologies,
            }
        )

    def read_json(self) -> dict[str, Any]:
        length_header = self.headers.get("Content-Length", "0")
        try:
            length = int(length_header)
        except ValueError as exc:
            raise ValueError("Invalid Content-Length") from exc

        raw_body = self.rfile.read(length)
        try:
            payload = json.loads(raw_body.decode("utf-8") or "{}")
        except json.JSONDecodeError as exc:
            raise ValueError("Invalid JSON") from exc

        if not isinstance(payload, dict):
            raise ValueError("JSON body must be an object")

        return payload

    def send_json(self, payload: dict[str, Any], status: int = 200) -> None:
        body = b"" if status == 204 else json.dumps(payload).encode("utf-8")

        self.send_response(status)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()

        if body:
            self.wfile.write(body)

    def log_message(self, format: str, *args: Any) -> None:
        print(f"{self.address_string()} - {format % args}")


def run() -> None:
    server = ThreadingHTTPServer((HOST, PORT), ResumeBuilderHandler)
    print(f"Python backend listening on http://{HOST}:{PORT}")
    print("Press Ctrl+C to stop.")
    server.serve_forever()


if __name__ == "__main__":
    run()
