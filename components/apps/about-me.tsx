export default function AboutMe() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">About Me</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="rounded-lg overflow-hidden mb-4">
            <img src="/confident-professional.png" alt="Profile" className="w-full h-auto" />
          </div>
        </div>
        <div className="md:w-2/3">
          <p className="mb-4">
            Hello! I'm Daniel, a passionate full stack developer with a love for all things tech - from hardware to
            software, AI to game development.
          </p>
          <p className="mb-4">
            While I primarily focus on web development using modern frameworks and technologies, I've also ventured into
            game development and app creation. I enjoy tackling complex problems and turning ideas into reality through
            code.
          </p>
          <p className="mb-4">
            When I'm not coding, you can find me exploring emerging technologies, contributing to open-source projects,
            or experimenting with new development techniques and tools.
          </p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Quick Facts</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Based in Denmark</li>
              <li>27 years old</li>
              <li>5+ years of experience in software development</li>
              <li>Graduated from Aalborg Universitet</li>
              <li>Currently working as a Senior Software Developer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
