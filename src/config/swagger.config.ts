import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const title = 'OKK UI API';
const description = `
API ini menyediakan fitur pengelolaan kegiatan Orientasi Kehidupan Kampus (OKK) Universitas Indonesia, yang mencakup berbagai entitas seperti acara, panitia, divisi, kelompok mentoring, dan sponsor. Dengan API ini, pengguna dapat melakukan operasi CRUD (Create, Read, Update, Delete) untuk setiap entitas tersebut. Fitur utama API ini meliputi pengelolaan acara OKK UI, yang mencakup informasi tentang nama acara, waktu mulai, waktu selesai, tempat, deskripsi, sponsor, dan pembicara. Selain itu, API juga mendukung pengelolaan data panitia, yang terdiri dari Pengurus Inti dan Badan Pengurus Harian (BPH), serta divisi-divisi yang terkait.

API ini juga menyediakan fitur untuk mengelola kelompok mentoring, termasuk mentor dan mentee, serta jadwal mentoring yang mencatat kehadiran, waktu, tempat, dan materi yang diberikan. Selain itu, API mendukung pengelolaan data sponsor yang mendukung berbagai acara dengan paket sponsor berbeda, serta data pembicara yang terlibat dalam satu atau lebih acara OKK UI. Dengan fitur-fitur ini, API OKK UI membantu dalam pengelolaan dan koordinasi kegiatan orientasi bagi mahasiswa baru Universitas Indonesia secara efektif dan efisien.`;
const version = '1.0';
const contact = {
  name: 'Restu Ahmad Ar Ridho',
  github: 'https://github.com/restuaar',
  email: 'restuaarridho@gmail.com',
};
const license = {
  name: 'MIT',
  url: 'https://opensource.org/licenses/MIT',
};
const externalDocs = {
  description: 'Find out more about Swagger',
  url: 'http://swagger.io',
};
const servers = [
  {
    url: 'http://localhost:3000/{version}',
    description: 'Development server',
    variables: {
      version: {
        enum: ['v1'],
        default: 'v1',
      },
    },
  },
];

export function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .setContact(contact.name, contact.github, contact.email)
    .setLicense(license.name, license.url)
    .setExternalDoc(externalDocs.description, externalDocs.url)
    .addServer(servers[0].url, servers[0].description, servers[0].variables)
    .addBearerAuth({ in: 'header', type: 'http', bearerFormat: 'JWT' })
    .addCookieAuth('refreshToken')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
}
