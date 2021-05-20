<?php

namespace WebApps\Apps\StaffDirectory\Database\Seeders;

use Illuminate\Database\Seeder;
use WebApps\Apps\StaffDirectory\Database\Factories\DepartmentFactory;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DepartmentFactory::new()
            ->count(25)
            ->create();
    }
}
