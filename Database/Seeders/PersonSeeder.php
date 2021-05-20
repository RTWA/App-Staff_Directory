<?php

namespace WebApps\Apps\StaffDirectory\Database\Seeders;

use Illuminate\Database\Seeder;
use WebApps\Apps\StaffDirectory\Database\Factories\PersonFactory;

class PersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        PersonFactory::new()
            ->count(200)
            ->create();
    }
}
